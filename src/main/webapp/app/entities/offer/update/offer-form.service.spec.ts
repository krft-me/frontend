import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../offer.test-samples';

import { OfferFormService } from './offer-form.service';

describe('Offer Form Service', () => {
  let service: OfferFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferFormService);
  });

  describe('Service methods', () => {
    describe('createOfferFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOfferFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IOffer should create a new form with FormGroup', () => {
        const formGroup = service.createOfferFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getOffer', () => {
      it('should return NewOffer for default Offer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOfferFormGroup(sampleWithNewData);

        const offer = service.getOffer(formGroup) as any;

        expect(offer).toMatchObject(sampleWithNewData);
      });

      it('should return NewOffer for empty Offer initial value', () => {
        const formGroup = service.createOfferFormGroup();

        const offer = service.getOffer(formGroup) as any;

        expect(offer).toMatchObject({});
      });

      it('should return IOffer', () => {
        const formGroup = service.createOfferFormGroup(sampleWithRequiredData);

        const offer = service.getOffer(formGroup) as any;

        expect(offer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOffer should not enable id FormControl', () => {
        const formGroup = service.createOfferFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOffer should disable id FormControl', () => {
        const formGroup = service.createOfferFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
