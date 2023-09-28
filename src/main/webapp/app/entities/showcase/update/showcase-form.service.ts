import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IShowcase, NewShowcase } from '../showcase.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShowcase for edit and NewShowcaseFormGroupInput for create.
 */
type ShowcaseFormGroupInput = IShowcase | PartialWithRequiredKeyOf<NewShowcase>;

type ShowcaseFormDefaults = Pick<NewShowcase, 'id'>;

type ShowcaseFormGroupContent = {
  id: FormControl<IShowcase['id'] | NewShowcase['id']>;
  imageId: FormControl<IShowcase['imageId']>;
  applicationUserOffer: FormControl<IShowcase['applicationUserOffer']>;
};

export type ShowcaseFormGroup = FormGroup<ShowcaseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShowcaseFormService {
  createShowcaseFormGroup(showcase: ShowcaseFormGroupInput = { id: null }): ShowcaseFormGroup {
    const showcaseRawValue = {
      ...this.getFormDefaults(),
      ...showcase,
    };
    return new FormGroup<ShowcaseFormGroupContent>({
      id: new FormControl(
        { value: showcaseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      imageId: new FormControl(showcaseRawValue.imageId, {
        validators: [Validators.required],
      }),
      applicationUserOffer: new FormControl(showcaseRawValue.applicationUserOffer),
    });
  }

  getShowcase(form: ShowcaseFormGroup): IShowcase | NewShowcase {
    return form.getRawValue() as IShowcase | NewShowcase;
  }

  resetForm(form: ShowcaseFormGroup, showcase: ShowcaseFormGroupInput): void {
    const showcaseRawValue = { ...this.getFormDefaults(), ...showcase };
    form.reset(
      {
        ...showcaseRawValue,
        id: { value: showcaseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ShowcaseFormDefaults {
    return {
      id: null,
    };
  }
}
