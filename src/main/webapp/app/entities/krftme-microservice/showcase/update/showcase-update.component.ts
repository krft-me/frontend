import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ShowcaseFormGroup, ShowcaseFormService } from './showcase-form.service';
import { IShowcase } from '../showcase.model';
import { ShowcaseService } from '../service/showcase.service';
import { IApplicationUserOffer } from 'app/entities/krftme-microservice/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/krftme-microservice/application-user-offer/service/application-user-offer.service';

@Component({
  selector: 'krftme-showcase-update',
  templateUrl: './showcase-update.component.html',
})
export class ShowcaseUpdateComponent implements OnInit {
  isSaving = false;
  showcase: IShowcase | null = null;

  applicationUserOffersSharedCollection: IApplicationUserOffer[] = [];

  editForm: ShowcaseFormGroup = this.showcaseFormService.createShowcaseFormGroup();

  constructor(
    protected showcaseService: ShowcaseService,
    protected showcaseFormService: ShowcaseFormService,
    protected applicationUserOfferService: ApplicationUserOfferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUserOffer = (o1: IApplicationUserOffer | null, o2: IApplicationUserOffer | null): boolean =>
    this.applicationUserOfferService.compareApplicationUserOffer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ showcase }) => {
      this.showcase = showcase;
      if (showcase) {
        this.updateForm(showcase);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const showcase = this.showcaseFormService.getShowcase(this.editForm);
    if (showcase.id !== null) {
      this.subscribeToSaveResponse(this.showcaseService.update(showcase));
    } else {
      this.subscribeToSaveResponse(this.showcaseService.create(showcase));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShowcase>>): void {
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

  protected updateForm(showcase: IShowcase): void {
    this.showcase = showcase;
    this.showcaseFormService.resetForm(this.editForm, showcase);

    this.applicationUserOffersSharedCollection =
      this.applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing<IApplicationUserOffer>(
        this.applicationUserOffersSharedCollection,
        showcase.offer
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
            this.showcase?.offer
          )
        )
      )
      .subscribe((applicationUserOffers: IApplicationUserOffer[]) => (this.applicationUserOffersSharedCollection = applicationUserOffers));
  }
}
