import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMachine, NewMachine } from '../machine.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMachine for edit and NewMachineFormGroupInput for create.
 */
type MachineFormGroupInput = IMachine | PartialWithRequiredKeyOf<NewMachine>;

type MachineFormDefaults = Pick<NewMachine, 'id'>;

type MachineFormGroupContent = {
  id: FormControl<IMachine['id'] | NewMachine['id']>;
  name: FormControl<IMachine['name']>;
  offer: FormControl<IMachine['offer']>;
};

export type MachineFormGroup = FormGroup<MachineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MachineFormService {
  createMachineFormGroup(machine: MachineFormGroupInput = { id: null }): MachineFormGroup {
    const machineRawValue = {
      ...this.getFormDefaults(),
      ...machine,
    };
    return new FormGroup<MachineFormGroupContent>({
      id: new FormControl(
        { value: machineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(machineRawValue.name, {
        validators: [Validators.required],
      }),
      offer: new FormControl(machineRawValue.offer),
    });
  }

  getMachine(form: MachineFormGroup): IMachine | NewMachine {
    return form.getRawValue() as IMachine | NewMachine;
  }

  resetForm(form: MachineFormGroup, machine: MachineFormGroupInput): void {
    const machineRawValue = { ...this.getFormDefaults(), ...machine };
    form.reset(
      {
        ...machineRawValue,
        id: { value: machineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MachineFormDefaults {
    return {
      id: null,
    };
  }
}
