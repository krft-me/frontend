import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IApplicationUser, NewApplicationUser } from '../application-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplicationUser for edit and NewApplicationUserFormGroupInput for create.
 */
type ApplicationUserFormGroupInput = IApplicationUser | PartialWithRequiredKeyOf<NewApplicationUser>;

type ApplicationUserFormDefaults = Pick<NewApplicationUser, 'id' | 'favoriteApplicationUsers' | 'favoriteOffers' | 'followers'>;

type ApplicationUserFormGroupContent = {
  id: FormControl<IApplicationUser['id'] | NewApplicationUser['id']>;
  firstName: FormControl<IApplicationUser['firstName']>;
  lastName: FormControl<IApplicationUser['lastName']>;
  pseudo: FormControl<IApplicationUser['pseudo']>;
  averageRating: FormControl<IApplicationUser['averageRating']>;
  internalUser: FormControl<IApplicationUser['internalUser']>;
  city: FormControl<IApplicationUser['city']>;
  favoriteApplicationUsers: FormControl<IApplicationUser['favoriteApplicationUsers']>;
  favoriteOffers: FormControl<IApplicationUser['favoriteOffers']>;
  followers: FormControl<IApplicationUser['followers']>;
};

export type ApplicationUserFormGroup = FormGroup<ApplicationUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserFormService {
  createApplicationUserFormGroup(applicationUser: ApplicationUserFormGroupInput = { id: null }): ApplicationUserFormGroup {
    const applicationUserRawValue = {
      ...this.getFormDefaults(),
      ...applicationUser,
    };
    return new FormGroup<ApplicationUserFormGroupContent>({
      id: new FormControl(
        { value: applicationUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(applicationUserRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(applicationUserRawValue.lastName, {
        validators: [Validators.required],
      }),
      pseudo: new FormControl(applicationUserRawValue.pseudo, {
        validators: [Validators.required],
      }),
      averageRating: new FormControl(applicationUserRawValue.averageRating, {
        validators: [Validators.required],
      }),
      internalUser: new FormControl(applicationUserRawValue.internalUser),
      city: new FormControl(applicationUserRawValue.city),
      favoriteApplicationUsers: new FormControl(applicationUserRawValue.favoriteApplicationUsers ?? []),
      favoriteOffers: new FormControl(applicationUserRawValue.favoriteOffers ?? []),
      followers: new FormControl(applicationUserRawValue.followers ?? []),
    });
  }

  getApplicationUser(form: ApplicationUserFormGroup): IApplicationUser | NewApplicationUser {
    return form.getRawValue() as IApplicationUser | NewApplicationUser;
  }

  resetForm(form: ApplicationUserFormGroup, applicationUser: ApplicationUserFormGroupInput): void {
    const applicationUserRawValue = { ...this.getFormDefaults(), ...applicationUser };
    form.reset(
      {
        ...applicationUserRawValue,
        id: { value: applicationUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ApplicationUserFormDefaults {
    return {
      id: null,
      favoriteApplicationUsers: [],
      favoriteOffers: [],
      followers: [],
    };
  }
}
