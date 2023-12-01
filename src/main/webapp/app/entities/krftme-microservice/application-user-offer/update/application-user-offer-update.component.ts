import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApplicationUserOfferFormGroup, ApplicationUserOfferFormService } from './application-user-offer-form.service';
import { IApplicationUserOffer } from '../application-user-offer.model';
import { ApplicationUserOfferService } from '../service/application-user-offer.service';
import { ITag } from 'app/entities/krftme-microservice/tag/tag.model';
import { TagService } from 'app/entities/krftme-microservice/tag/service/tag.service';
import { IApplicationUser } from 'app/entities/krftme-microservice/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/krftme-microservice/application-user/service/application-user.service';
import { IOffer } from 'app/entities/krftme-microservice/offer/offer.model';
import { OfferService } from 'app/entities/krftme-microservice/offer/service/offer.service';

@Component({
  selector: 'krftme-application-user-offer-update',
  templateUrl: './application-user-offer-update.component.html',
})
export class ApplicationUserOfferUpdateComponent implements OnInit {
  isSaving = false;
  applicationUserOffer: IApplicationUserOffer | null = null;

  tagsSharedCollection: ITag[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];
  offersSharedCollection: IOffer[] = [];

  editForm: ApplicationUserOfferFormGroup = this.applicationUserOfferFormService.createApplicationUserOfferFormGroup();

  constructor(
    protected applicationUserOfferService: ApplicationUserOfferService,
    protected applicationUserOfferFormService: ApplicationUserOfferFormService,
    protected tagService: TagService,
    protected applicationUserService: ApplicationUserService,
    protected offerService: OfferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareOffer = (o1: IOffer | null, o2: IOffer | null): boolean => this.offerService.compareOffer(o1, o2);

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

    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(
      this.tagsSharedCollection,
      ...(applicationUserOffer.tags ?? [])
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      applicationUserOffer.provider
    );
    this.offersSharedCollection = this.offerService.addOfferToCollectionIfMissing<IOffer>(
      this.offersSharedCollection,
      applicationUserOffer.offer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.applicationUserOffer?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
            applicationUsers,
            this.applicationUserOffer?.provider
          )
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.offerService
      .query()
      .pipe(map((res: HttpResponse<IOffer[]>) => res.body ?? []))
      .pipe(map((offers: IOffer[]) => this.offerService.addOfferToCollectionIfMissing<IOffer>(offers, this.applicationUserOffer?.offer)))
      .subscribe((offers: IOffer[]) => (this.offersSharedCollection = offers));
  }
}
