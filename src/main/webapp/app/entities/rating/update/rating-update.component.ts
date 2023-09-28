import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RatingFormService, RatingFormGroup } from './rating-form.service';
import { IRating } from '../rating.model';
import { RatingService } from '../service/rating.service';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/application-user-offer/service/application-user-offer.service';

@Component({
  selector: 'jhi-rating-update',
  templateUrl: './rating-update.component.html',
})
export class RatingUpdateComponent implements OnInit {
  isSaving = false;
  rating: IRating | null = null;

  applicationUserOffersSharedCollection: IApplicationUserOffer[] = [];

  editForm: RatingFormGroup = this.ratingFormService.createRatingFormGroup();

  constructor(
    protected ratingService: RatingService,
    protected ratingFormService: RatingFormService,
    protected applicationUserOfferService: ApplicationUserOfferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUserOffer = (o1: IApplicationUserOffer | null, o2: IApplicationUserOffer | null): boolean =>
    this.applicationUserOfferService.compareApplicationUserOffer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rating }) => {
      this.rating = rating;
      if (rating) {
        this.updateForm(rating);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rating = this.ratingFormService.getRating(this.editForm);
    if (rating.id !== null) {
      this.subscribeToSaveResponse(this.ratingService.update(rating));
    } else {
      this.subscribeToSaveResponse(this.ratingService.create(rating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRating>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(rating: IRating): void {
    this.rating = rating;
    this.ratingFormService.resetForm(this.editForm, rating);

    this.applicationUserOffersSharedCollection =
      this.applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing<IApplicationUserOffer>(
        this.applicationUserOffersSharedCollection,
        rating.applicationUserOffer
      );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserOfferService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUserOffer[]>) => res.body ?? []))
      .pipe(
        map((applicationUserOffers: IApplicationUserOffer[]) =>
          this.applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing<IApplicationUserOffer>(
            applicationUserOffers,
            this.rating?.applicationUserOffer
          )
        )
      )
      .subscribe((applicationUserOffers: IApplicationUserOffer[]) => (this.applicationUserOffersSharedCollection = applicationUserOffers));
  }
}
