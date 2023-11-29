import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IMachineCategory, NewMachineCategory } from "../machine-category.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMachineCategory for edit and NewMachineCategoryFormGroupInput for create.
 */
type MachineCategoryFormGroupInput = IMachineCategory | PartialWithRequiredKeyOf<NewMachineCategory>;

type MachineCategoryFormDefaults = Pick<NewMachineCategory, 'id'>;

type MachineCategoryFormGroupContent = {
  id: FormControl<IMachineCategory['id'] | NewMachineCategory['id']>;
  label: FormControl<IMachineCategory['label']>;
};

export type MachineCategoryFormGroup = FormGroup<MachineCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MachineCategoryFormService {
  createMachineCategoryFormGroup(machineCategory: MachineCategoryFormGroupInput = { id: null }): MachineCategoryFormGroup {
    const machineCategoryRawValue = {
      ...this.getFormDefaults(),
      ...machineCategory,
    };
    return new FormGroup<MachineCategoryFormGroupContent>({
      id: new FormControl(
        { value: machineCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      label: new FormControl(machineCategoryRawValue.label, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });
  }

  getMachineCategory(form: MachineCategoryFormGroup): IMachineCategory | NewMachineCategory {
    return form.getRawValue() as IMachineCategory | NewMachineCategory;
  }

  resetForm(form: MachineCategoryFormGroup, machineCategory: MachineCategoryFormGroupInput): void {
    const machineCategoryRawValue = { ...this.getFormDefaults(), ...machineCategory };
    form.reset(
      {
        ...machineCategoryRawValue,
        id: { value: machineCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MachineCategoryFormDefaults {
    return {
      id: null,
    };
  }
}
