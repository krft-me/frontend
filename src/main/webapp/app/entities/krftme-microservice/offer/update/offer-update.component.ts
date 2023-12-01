import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OfferFormGroup, OfferFormService } from './offer-form.service';
import { IOffer } from '../offer.model';
import { OfferService } from '../service/offer.service';
import { IMachine } from 'app/entities/krftme-microservice/machine/machine.model';
import { MachineService } from 'app/entities/krftme-microservice/machine/service/machine.service';
import { IOfferCategory } from 'app/entities/krftme-microservice/offer-category/offer-category.model';
import { OfferCategoryService } from 'app/entities/krftme-microservice/offer-category/service/offer-category.service';

@Component({
  selector: 'krftme-offer-update',
  templateUrl: './offer-update.component.html',
})
export class OfferUpdateComponent implements OnInit {
  isSaving = false;
  offer: IOffer | null = null;

  machinesSharedCollection: IMachine[] = [];
  offerCategoriesSharedCollection: IOfferCategory[] = [];

  editForm: OfferFormGroup = this.offerFormService.createOfferFormGroup();

  constructor(
    protected offerService: OfferService,
    protected offerFormService: OfferFormService,
    protected machineService: MachineService,
    protected offerCategoryService: OfferCategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMachine = (o1: IMachine | null, o2: IMachine | null): boolean => this.machineService.compareMachine(o1, o2);

  compareOfferCategory = (o1: IOfferCategory | null, o2: IOfferCategory | null): boolean =>
    this.offerCategoryService.compareOfferCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offer }) => {
      this.offer = offer;
      if (offer) {
        this.updateForm(offer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offer = this.offerFormService.getOffer(this.editForm);
    if (offer.id !== null) {
      this.subscribeToSaveResponse(this.offerService.update(offer));
    } else {
      this.subscribeToSaveResponse(this.offerService.create(offer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffer>>): void {
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

  protected updateForm(offer: IOffer): void {
    this.offer = offer;
    this.offerFormService.resetForm(this.editForm, offer);

    this.machinesSharedCollection = this.machineService.addMachineToCollectionIfMissing<IMachine>(
      this.machinesSharedCollection,
      offer.machine
    );
    this.offerCategoriesSharedCollection = this.offerCategoryService.addOfferCategoryToCollectionIfMissing<IOfferCategory>(
      this.offerCategoriesSharedCollection,
      offer.category
    );
  }

  protected loadRelationshipsOptions(): void {
    this.machineService
      .query()
      .pipe(map((res: HttpResponse<IMachine[]>) => res.body ?? []))
      .pipe(map((machines: IMachine[]) => this.machineService.addMachineToCollectionIfMissing<IMachine>(machines, this.offer?.machine)))
      .subscribe((machines: IMachine[]) => (this.machinesSharedCollection = machines));

    this.offerCategoryService
      .query()
      .pipe(map((res: HttpResponse<IOfferCategory[]>) => res.body ?? []))
      .pipe(
        map((offerCategories: IOfferCategory[]) =>
          this.offerCategoryService.addOfferCategoryToCollectionIfMissing<IOfferCategory>(offerCategories, this.offer?.category)
        )
      )
      .subscribe((offerCategories: IOfferCategory[]) => (this.offerCategoriesSharedCollection = offerCategories));
  }
}
