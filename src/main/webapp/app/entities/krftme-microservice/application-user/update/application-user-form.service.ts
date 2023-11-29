import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IApplicationUser, NewApplicationUser } from "../application-user.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, "id">> & { id: T["id"] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplicationUser for edit and NewApplicationUserFormGroupInput for create.
 */
type ApplicationUserFormGroupInput = IApplicationUser | PartialWithRequiredKeyOf<NewApplicationUser>;

type ApplicationUserFormDefaults = Pick<NewApplicationUser, 'id'>;

type ApplicationUserFormGroupContent = {
  id: FormControl<IApplicationUser['id'] | NewApplicationUser['id']>;
  firstName: FormControl<IApplicationUser['firstName']>;
  lastName: FormControl<IApplicationUser['lastName']>;
  username: FormControl<IApplicationUser['username']>;
  profilePictureId: FormControl<IApplicationUser['profilePictureId']>;
  internalUser: FormControl<IApplicationUser['internalUser']>;
  city: FormControl<IApplicationUser['city']>;
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
        validators: [Validators.required, Validators.minLength(1)],
      }),
      lastName: new FormControl(applicationUserRawValue.lastName, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      username: new FormControl(applicationUserRawValue.username, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      profilePictureId: new FormControl(applicationUserRawValue.profilePictureId),
      internalUser: new FormControl(applicationUserRawValue.internalUser),
      city: new FormControl(applicationUserRawValue.city),
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
    };
  }
}
