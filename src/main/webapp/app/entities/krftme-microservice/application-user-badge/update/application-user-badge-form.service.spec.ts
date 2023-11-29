import { TestBed } from "@angular/core/testing";

import { sampleWithNewData, sampleWithRequiredData } from "../application-user-badge.test-samples";

import { ApplicationUserBadgeFormService } from "./application-user-badge-form.service";

describe('ApplicationUserBadge Form Service', () => {
  let service: ApplicationUserBadgeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationUserBadgeFormService);
  });

  describe('Service methods', () => {
    describe('createApplicationUserBadgeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createApplicationUserBadgeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            obtainedDate: expect.any(Object),
            user: expect.any(Object),
            badge: expect.any(Object)
          })
        );
      });

      it('passing IApplicationUserBadge should create a new form with FormGroup', () => {
        const formGroup = service.createApplicationUserBadgeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            obtainedDate: expect.any(Object),
            user: expect.any(Object),
            badge: expect.any(Object
          })
        );
      });
    });

    describe('getApplicationUserBadge', () => {
      it('should return NewApplicationUserBadge for default ApplicationUserBadge initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createApplicationUserBadgeFormGroup(sampleWithNewData);

        const applicationUserBadge = service.getApplicationUserBadge(formGroup) as any;

        expect(applicationUserBadge).toMatchObject(sampleWithNewData);
      });

      it('should return NewApplicationUserBadge for empty ApplicationUserBadge initial value', () => {
        const formGroup = service.createApplicationUserBadgeFormGroup();

        const applicationUserBadge = service.getApplicationUserBadge(formGroup) as any;

        expect(applicationUserBadge).toMatchObject({});
      });

      it('should return IApplicationUserBadge', () => {
        const formGroup = service.createApplicationUserBadgeFormGroup(sampleWithRequiredData);

        const applicationUserBadge = service.getApplicationUserBadge(formGroup) as any;

        expect(applicationUserBadge).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IApplicationUserBadge should not enable id FormControl', () => {
        const formGroup = service.createApplicationUserBadgeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewApplicationUserBadge should disable id FormControl', () => {
        const formGroup = service.createApplicationUserBadgeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
