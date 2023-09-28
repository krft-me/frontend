import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../showcase.test-samples';

import { ShowcaseFormService } from './showcase-form.service';

describe('Showcase Form Service', () => {
  let service: ShowcaseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowcaseFormService);
  });

  describe('Service methods', () => {
    describe('createShowcaseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShowcaseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            imageId: expect.any(Object),
            applicationUserOffer: expect.any(Object),
          })
        );
      });

      it('passing IShowcase should create a new form with FormGroup', () => {
        const formGroup = service.createShowcaseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            imageId: expect.any(Object),
            applicationUserOffer: expect.any(Object),
          })
        );
      });
    });

    describe('getShowcase', () => {
      it('should return NewShowcase for default Showcase initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createShowcaseFormGroup(sampleWithNewData);

        const showcase = service.getShowcase(formGroup) as any;

        expect(showcase).toMatchObject(sampleWithNewData);
      });

      it('should return NewShowcase for empty Showcase initial value', () => {
        const formGroup = service.createShowcaseFormGroup();

        const showcase = service.getShowcase(formGroup) as any;

        expect(showcase).toMatchObject({});
      });

      it('should return IShowcase', () => {
        const formGroup = service.createShowcaseFormGroup(sampleWithRequiredData);

        const showcase = service.getShowcase(formGroup) as any;

        expect(showcase).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShowcase should not enable id FormControl', () => {
        const formGroup = service.createShowcaseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShowcase should disable id FormControl', () => {
        const formGroup = service.createShowcaseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
