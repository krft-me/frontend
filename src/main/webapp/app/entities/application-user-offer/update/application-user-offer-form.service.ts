import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IApplicationUserOffer, NewApplicationUserOffer } from '../application-user-offer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplicationUserOffer for edit and NewApplicationUserOfferFormGroupInput for create.
 */
type ApplicationUserOfferFormGroupInput = IApplicationUserOffer | PartialWithRequiredKeyOf<NewApplicationUserOffer>;

type ApplicationUserOfferFormDefaults = Pick<NewApplicationUserOffer, 'id'>;

type ApplicationUserOfferFormGroupContent = {
  id: FormControl<IApplicationUserOffer['id'] | NewApplicationUserOffer['id']>;
  description: FormControl<IApplicationUserOffer['description']>;
  offer: FormControl<IApplicationUserOffer['offer']>;
  applicationUser: FormControl<IApplicationUserOffer['applicationUser']>;
};

export type ApplicationUserOfferFormGroup = FormGroup<ApplicationUserOfferFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserOfferFormService {
  createApplicationUserOfferFormGroup(
    applicationUserOffer: ApplicationUserOfferFormGroupInput = { id: null }
  ): ApplicationUserOfferFormGroup {
    const applicationUserOfferRawValue = {
      ...this.getFormDefaults(),
      ...applicationUserOffer,
    };
    return new FormGroup<ApplicationUserOfferFormGroupContent>({
      id: new FormControl(
        { value: applicationUserOfferRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(applicationUserOfferRawValue.description, {
        validators: [Validators.required],
      }),
      offer: new FormControl(applicationUserOfferRawValue.offer),
      applicationUser: new FormControl(applicationUserOfferRawValue.applicationUser),
    });
  }

  getApplicationUserOffer(form: ApplicationUserOfferFormGroup): IApplicationUserOffer | NewApplicationUserOffer {
    return form.getRawValue() as IApplicationUserOffer | NewApplicationUserOffer;
  }

  resetForm(form: ApplicationUserOfferFormGroup, applicationUserOffer: ApplicationUserOfferFormGroupInput): void {
    const applicationUserOfferRawValue = { ...this.getFormDefaults(), ...applicationUserOffer };
    form.reset(
      {
        ...applicationUserOfferRawValue,
        id: { value: applicationUserOfferRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ApplicationUserOfferFormDefaults {
    return {
      id: null,
    };
  }
}
