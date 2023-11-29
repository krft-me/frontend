import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IBadge, NewBadge } from "../badge.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, "id">> & { id: T["id"] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBadge for edit and NewBadgeFormGroupInput for create.
 */
type BadgeFormGroupInput = IBadge | PartialWithRequiredKeyOf<NewBadge>;

type BadgeFormDefaults = Pick<NewBadge, 'id'>;

type BadgeFormGroupContent = {
  id: FormControl<IBadge['id'] | NewBadge['id']>;
  label: FormControl<IBadge['label']>;
  picture: FormControl<IBadge['picture']>;
};

export type BadgeFormGroup = FormGroup<BadgeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BadgeFormService {
  createBadgeFormGroup(badge: BadgeFormGroupInput = { id: null }): BadgeFormGroup {
    const badgeRawValue = {
      ...this.getFormDefaults(),
      ...badge,
    };
    return new FormGroup<BadgeFormGroupContent>({
      id: new FormControl(
        { value: badgeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      label: new FormControl(badgeRawValue.label, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      picture: new FormControl(badgeRawValue.picture, {
        validators: [Validators.required],
      }),
    });
  }

  getBadge(form: BadgeFormGroup): IBadge | NewBadge {
    return form.getRawValue() as IBadge | NewBadge;
  }

  resetForm(form: BadgeFormGroup, badge: BadgeFormGroupInput): void {
    const badgeRawValue = { ...this.getFormDefaults(), ...badge };
    form.reset(
      {
        ...badgeRawValue,
        id: { value: badgeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BadgeFormDefaults {
    return {
      id: null,
    };
  }
}
