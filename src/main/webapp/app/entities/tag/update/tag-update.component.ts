import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TagFormService, TagFormGroup } from './tag-form.service';
import { ITag } from '../tag.model';
import { TagService } from '../service/tag.service';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/application-user-offer/service/application-user-offer.service';

@Component({
  selector: 'krftme-tag-update',
  templateUrl: './tag-update.component.html',
})
export class TagUpdateComponent implements OnInit {
  isSaving = false;
  tag: ITag | null = null;

  applicationUserOffersSharedCollection: IApplicationUserOffer[] = [];

  editForm: TagFormGroup = this.tagFormService.createTagFormGroup();

  constructor(
    protected tagService: TagService,
    protected tagFormService: TagFormService,
    protected applicationUserOfferService: ApplicationUserOfferService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUserOffer = (o1: IApplicationUserOffer | null, o2: IApplicationUserOffer | null): boolean =>
    this.applicationUserOfferService.compareApplicationUserOffer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tag }) => {
      this.tag = tag;
      if (tag) {
        this.updateForm(tag);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tag = this.tagFormService.getTag(this.editForm);
    if (tag.id !== null) {
      this.subscribeToSaveResponse(this.tagService.update(tag));
    } else {
      this.subscribeToSaveResponse(this.tagService.create(tag));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITag>>): void {
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

  protected updateForm(tag: ITag): void {
    this.tag = tag;
    this.tagFormService.resetForm(this.editForm, tag);

    this.applicationUserOffersSharedCollection =
      this.applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing<IApplicationUserOffer>(
        this.applicationUserOffersSharedCollection,
        tag.applicationUserOffer
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
            this.tag?.applicationUserOffer
          )
        )
      )
      .subscribe((applicationUserOffers: IApplicationUserOffer[]) => (this.applicationUserOffersSharedCollection = applicationUserOffers));
  }
}
