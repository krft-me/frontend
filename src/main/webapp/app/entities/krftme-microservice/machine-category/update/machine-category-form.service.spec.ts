import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../machine-category.test-samples';

import { MachineCategoryFormService } from './machine-category-form.service';

describe('MachineCategory Form Service', () => {
  let service: MachineCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createMachineCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMachineCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
          })
        );
      });

      it('passing IMachineCategory should create a new form with FormGroup', () => {
        const formGroup = service.createMachineCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
          })
        );
      });
    });

    describe('getMachineCategory', () => {
      it('should return NewMachineCategory for default MachineCategory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMachineCategoryFormGroup(sampleWithNewData);

        const machineCategory = service.getMachineCategory(formGroup) as any;

        expect(machineCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewMachineCategory for empty MachineCategory initial value', () => {
        const formGroup = service.createMachineCategoryFormGroup();

        const machineCategory = service.getMachineCategory(formGroup) as any;

        expect(machineCategory).toMatchObject({});
      });

      it('should return IMachineCategory', () => {
        const formGroup = service.createMachineCategoryFormGroup(sampleWithRequiredData);

        const machineCategory = service.getMachineCategory(formGroup) as any;

        expect(machineCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMachineCategory should not enable id FormControl', () => {
        const formGroup = service.createMachineCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMachineCategory should disable id FormControl', () => {
        const formGroup = service.createMachineCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
