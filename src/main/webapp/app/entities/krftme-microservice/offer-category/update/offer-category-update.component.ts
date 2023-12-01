import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { OfferCategoryFormGroup, OfferCategoryFormService } from './offer-category-form.service';
import { IOfferCategory } from '../offer-category.model';
import { OfferCategoryService } from '../service/offer-category.service';

@Component({
  selector: 'krftme-offer-category-update',
  templateUrl: './offer-category-update.component.html',
})
export class OfferCategoryUpdateComponent implements OnInit {
  isSaving = false;
  offerCategory: IOfferCategory | null = null;

  editForm: OfferCategoryFormGroup = this.offerCategoryFormService.createOfferCategoryFormGroup();

  constructor(
    protected offerCategoryService: OfferCategoryService,
    protected offerCategoryFormService: OfferCategoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offerCategory }) => {
      this.offerCategory = offerCategory;
      if (offerCategory) {
        this.updateForm(offerCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offerCategory = this.offerCategoryFormService.getOfferCategory(this.editForm);
    if (offerCategory.id !== null) {
      this.subscribeToSaveResponse(this.offerCategoryService.update(offerCategory));
    } else {
      this.subscribeToSaveResponse(this.offerCategoryService.create(offerCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOfferCategory>>): void {
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

  protected updateForm(offerCategory: IOfferCategory): void {
    this.offerCategory = offerCategory;
    this.offerCategoryFormService.resetForm(this.editForm, offerCategory);
  }
}
