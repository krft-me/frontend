import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApplicationUserOfferFormService, ApplicationUserOfferFormGroup } from './application-user-offer-form.service';
import { IApplicationUserOffer } from '../application-user-offer.model';
import { ApplicationUserOfferService } from '../service/application-user-offer.service';
import { IOffer } from 'app/entities/offer/offer.model';
import { OfferService } from 'app/entities/offer/service/offer.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

@Component({
  selector: 'krftme-application-user-offer-update',
  templateUrl: './application-user-offer-update.component.html',
})
export class ApplicationUserOfferUpdateComponent implements OnInit {
  isSaving = false;
  applicationUserOffer: IApplicationUserOffer | null = null;

  offersSharedCollection: IOffer[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm: ApplicationUserOfferFormGroup = this.applicationUserOfferFormService.createApplicationUserOfferFormGroup();

  constructor(
    protected applicationUserOfferService: ApplicationUserOfferService,
    protected applicationUserOfferFormService: ApplicationUserOfferFormService,
    protected offerService: OfferService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOffer = (o1: IOffer | null, o2: IOffer | null): boolean => this.offerService.compareOffer(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationUserOffer }) => {
      this.applicationUserOffer = applicationUserOffer;
      if (applicationUserOffer) {
        this.updateForm(applicationUserOffer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicationUserOffer = this.applicationUserOfferFormService.getApplicationUserOffer(this.editForm);
    if (applicationUserOffer.id !== null) {
      this.subscribeToSaveResponse(this.applicationUserOfferService.update(applicationUserOffer));
    } else {
      this.subscribeToSaveResponse(this.applicationUserOfferService.create(applicationUserOffer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationUserOffer>>): void {
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

  protected updateForm(applicationUserOffer: IApplicationUserOffer): void {
    this.applicationUserOffer = applicationUserOffer;
    this.applicationUserOfferFormService.resetForm(this.editForm, applicationUserOffer);

    this.offersSharedCollection = this.offerService.addOfferToCollectionIfMissing<IOffer>(
      this.offersSharedCollection,
      applicationUserOffer.offer
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      applicationUserOffer.applicationUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.offerService
      .query()
      .pipe(map((res: HttpResponse<IOffer[]>) => res.body ?? []))
      .pipe(map((offers: IOffer[]) => this.offerService.addOfferToCollectionIfMissing<IOffer>(offers, this.applicationUserOffer?.offer)))
      .subscribe((offers: IOffer[]) => (this.offersSharedCollection = offers));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.applicationUserOffer?.applicationUser
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }
}
