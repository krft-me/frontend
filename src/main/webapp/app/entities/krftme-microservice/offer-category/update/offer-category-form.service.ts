import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IOfferCategory, NewOfferCategory } from "../offer-category.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOfferCategory for edit and NewOfferCategoryFormGroupInput for create.
 */
type OfferCategoryFormGroupInput = IOfferCategory | PartialWithRequiredKeyOf<NewOfferCategory>;

type OfferCategoryFormDefaults = Pick<NewOfferCategory, 'id'>;

type OfferCategoryFormGroupContent = {
  id: FormControl<IOfferCategory['id'] | NewOfferCategory['id']>;
  label: FormControl<IOfferCategory['label']>;
};

export type OfferCategoryFormGroup = FormGroup<OfferCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OfferCategoryFormService {
  createOfferCategoryFormGroup(offerCategory: OfferCategoryFormGroupInput = { id: null }): OfferCategoryFormGroup {
    const offerCategoryRawValue = {
      ...this.getFormDefaults(),
      ...offerCategory,
    };
    return new FormGroup<OfferCategoryFormGroupContent>({
      id: new FormControl(
        { value: offerCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      label: new FormControl(offerCategoryRawValue.label, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });
  }

  getOfferCategory(form: OfferCategoryFormGroup): IOfferCategory | NewOfferCategory {
    return form.getRawValue() as IOfferCategory | NewOfferCategory;
  }

  resetForm(form: OfferCategoryFormGroup, offerCategory: OfferCategoryFormGroupInput): void {
    const offerCategoryRawValue = { ...this.getFormDefaults(), ...offerCategory };
    form.reset(
      {
        ...offerCategoryRawValue,
        id: { value: offerCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OfferCategoryFormDefaults {
    return {
      id: null,
    };
  }
}
