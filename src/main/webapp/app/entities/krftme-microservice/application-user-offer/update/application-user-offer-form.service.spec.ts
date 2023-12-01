import { TestBed } from "@angular/core/testing";

import { sampleWithNewData, sampleWithRequiredData } from "../application-user-offer.test-samples";

import { ApplicationUserOfferFormService } from "./application-user-offer-form.service";

describe('ApplicationUserOffer Form Service', () => {
  let service: ApplicationUserOfferFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationUserOfferFormService);
  });

  describe('Service methods', () => {
    describe('createApplicationUserOfferFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createApplicationUserOfferFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            price: expect.any(Object),
            active: expect.any(Object),
            tags: expect.any(Object),
            provider: expect.any(Object),
            offer: expect.any(Object)
          })
        );
      });

      it('passing IApplicationUserOffer should create a new form with FormGroup', () => {
        const formGroup = service.createApplicationUserOfferFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            price: expect.any(Object),
            active: expect.any(Object),
            tags: expect.any(Object),
            provider: expect.any(Object),
            offer: expect.any(Object),
          })
        );
      });
    });

    describe('getApplicationUserOffer', () => {
      it('should return NewApplicationUserOffer for default ApplicationUserOffer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createApplicationUserOfferFormGroup(sampleWithNewData);

        const applicationUserOffer = service.getApplicationUserOffer(formGroup) as any;

        expect(applicationUserOffer).toMatchObject(sampleWithNewData);
      });

      it('should return NewApplicationUserOffer for empty ApplicationUserOffer initial value', () => {
        const formGroup = service.createApplicationUserOfferFormGroup();

        const applicationUserOffer = service.getApplicationUserOffer(formGroup) as any;

        expect(applicationUserOffer).toMatchObject({});
      });

      it('should return IApplicationUserOffer', () => {
        const formGroup = service.createApplicationUserOfferFormGroup(sampleWithRequiredData);

        const applicationUserOffer = service.getApplicationUserOffer(formGroup) as any;

        expect(applicationUserOffer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IApplicationUserOffer should not enable id FormControl', () => {
        const formGroup = service.createApplicationUserOfferFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewApplicationUserOffer should disable id FormControl', () => {
        const formGroup = service.createApplicationUserOfferFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
