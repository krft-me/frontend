import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IApplicationUserBadge, NewApplicationUserBadge } from '../application-user-badge.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplicationUserBadge for edit and NewApplicationUserBadgeFormGroupInput for create.
 */
type ApplicationUserBadgeFormGroupInput = IApplicationUserBadge | PartialWithRequiredKeyOf<NewApplicationUserBadge>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IApplicationUserBadge | NewApplicationUserBadge> = Omit<T, 'obtentionDate'> & {
  obtentionDate?: string | null;
};

type ApplicationUserBadgeFormRawValue = FormValueOf<IApplicationUserBadge>;

type NewApplicationUserBadgeFormRawValue = FormValueOf<NewApplicationUserBadge>;

type ApplicationUserBadgeFormDefaults = Pick<NewApplicationUserBadge, 'id' | 'obtentionDate'>;

type ApplicationUserBadgeFormGroupContent = {
  id: FormControl<ApplicationUserBadgeFormRawValue['id'] | NewApplicationUserBadge['id']>;
  obtentionDate: FormControl<ApplicationUserBadgeFormRawValue['obtentionDate']>;
  applicationUser: FormControl<ApplicationUserBadgeFormRawValue['applicationUser']>;
  badge: FormControl<ApplicationUserBadgeFormRawValue['badge']>;
};

export type ApplicationUserBadgeFormGroup = FormGroup<ApplicationUserBadgeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserBadgeFormService {
  createApplicationUserBadgeFormGroup(
    applicationUserBadge: ApplicationUserBadgeFormGroupInput = { id: null }
  ): ApplicationUserBadgeFormGroup {
    const applicationUserBadgeRawValue = this.convertApplicationUserBadgeToApplicationUserBadgeRawValue({
      ...this.getFormDefaults(),
      ...applicationUserBadge,
    });
    return new FormGroup<ApplicationUserBadgeFormGroupContent>({
      id: new FormControl(
        { value: applicationUserBadgeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      obtentionDate: new FormControl(applicationUserBadgeRawValue.obtentionDate, {
        validators: [Validators.required],
      }),
      applicationUser: new FormControl(applicationUserBadgeRawValue.applicationUser),
      badge: new FormControl(applicationUserBadgeRawValue.badge),
    });
  }

  getApplicationUserBadge(form: ApplicationUserBadgeFormGroup): IApplicationUserBadge | NewApplicationUserBadge {
    return this.convertApplicationUserBadgeRawValueToApplicationUserBadge(
      form.getRawValue() as ApplicationUserBadgeFormRawValue | NewApplicationUserBadgeFormRawValue
    );
  }

  resetForm(form: ApplicationUserBadgeFormGroup, applicationUserBadge: ApplicationUserBadgeFormGroupInput): void {
    const applicationUserBadgeRawValue = this.convertApplicationUserBadgeToApplicationUserBadgeRawValue({
      ...this.getFormDefaults(),
      ...applicationUserBadge,
    });
    form.reset(
      {
        ...applicationUserBadgeRawValue,
        id: { value: applicationUserBadgeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ApplicationUserBadgeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      obtentionDate: currentTime,
    };
  }

  private convertApplicationUserBadgeRawValueToApplicationUserBadge(
    rawApplicationUserBadge: ApplicationUserBadgeFormRawValue | NewApplicationUserBadgeFormRawValue
  ): IApplicationUserBadge | NewApplicationUserBadge {
    return {
      ...rawApplicationUserBadge,
      obtentionDate: dayjs(rawApplicationUserBadge.obtentionDate, DATE_TIME_FORMAT),
    };
  }

  private convertApplicationUserBadgeToApplicationUserBadgeRawValue(
    applicationUserBadge: IApplicationUserBadge | (Partial<NewApplicationUserBadge> & ApplicationUserBadgeFormDefaults)
  ): ApplicationUserBadgeFormRawValue | PartialWithRequiredKeyOf<NewApplicationUserBadgeFormRawValue> {
    return {
      ...applicationUserBadge,
      obtentionDate: applicationUserBadge.obtentionDate ? applicationUserBadge.obtentionDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
