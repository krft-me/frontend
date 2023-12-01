import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../offer-category.test-samples';

import { OfferCategoryFormService } from './offer-category-form.service';

describe('OfferCategory Form Service', () => {
  let service: OfferCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createOfferCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOfferCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
          })
        );
      });

      it('passing IOfferCategory should create a new form with FormGroup', () => {
        const formGroup = service.createOfferCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
          })
        );
      });
    });

    describe('getOfferCategory', () => {
      it('should return NewOfferCategory for default OfferCategory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOfferCategoryFormGroup(sampleWithNewData);

        const offerCategory = service.getOfferCategory(formGroup) as any;

        expect(offerCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewOfferCategory for empty OfferCategory initial value', () => {
        const formGroup = service.createOfferCategoryFormGroup();

        const offerCategory = service.getOfferCategory(formGroup) as any;

        expect(offerCategory).toMatchObject({});
      });

      it('should return IOfferCategory', () => {
        const formGroup = service.createOfferCategoryFormGroup(sampleWithRequiredData);

        const offerCategory = service.getOfferCategory(formGroup) as any;

        expect(offerCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOfferCategory should not enable id FormControl', () => {
        const formGroup = service.createOfferCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOfferCategory should disable id FormControl', () => {
        const formGroup = service.createOfferCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
