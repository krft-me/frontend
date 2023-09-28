import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ApplicationUserOfferFormService } from './application-user-offer-form.service';
import { ApplicationUserOfferService } from '../service/application-user-offer.service';
import { IApplicationUserOffer } from '../application-user-offer.model';
import { IOffer } from 'app/entities/offer/offer.model';
import { OfferService } from 'app/entities/offer/service/offer.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

import { ApplicationUserOfferUpdateComponent } from './application-user-offer-update.component';

describe('ApplicationUserOffer Management Update Component', () => {
  let comp: ApplicationUserOfferUpdateComponent;
  let fixture: ComponentFixture<ApplicationUserOfferUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let applicationUserOfferFormService: ApplicationUserOfferFormService;
  let applicationUserOfferService: ApplicationUserOfferService;
  let offerService: OfferService;
  let applicationUserService: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ApplicationUserOfferUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ApplicationUserOfferUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserOfferUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationUserOfferFormService = TestBed.inject(ApplicationUserOfferFormService);
    applicationUserOfferService = TestBed.inject(ApplicationUserOfferService);
    offerService = TestBed.inject(OfferService);
    applicationUserService = TestBed.inject(ApplicationUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Offer query and add missing value', () => {
      const applicationUserOffer: IApplicationUserOffer = { id: 456 };
      const offer: IOffer = { id: 49363 };
      applicationUserOffer.offer = offer;

      const offerCollection: IOffer[] = [{ id: 12093 }];
      jest.spyOn(offerService, 'query').mockReturnValue(of(new HttpResponse({ body: offerCollection })));
      const additionalOffers = [offer];
      const expectedCollection: IOffer[] = [...additionalOffers, ...offerCollection];
      jest.spyOn(offerService, 'addOfferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUserOffer });
      comp.ngOnInit();

      expect(offerService.query).toHaveBeenCalled();
      expect(offerService.addOfferToCollectionIfMissing).toHaveBeenCalledWith(
        offerCollection,
        ...additionalOffers.map(expect.objectContaining)
      );
      expect(comp.offersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ApplicationUser query and add missing value', () => {
      const applicationUserOffer: IApplicationUserOffer = { id: 456 };
      const applicationUser: IApplicationUser = { id: 6726 };
      applicationUserOffer.applicationUser = applicationUser;

      const applicationUserCollection: IApplicationUser[] = [{ id: 55249 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [applicationUser];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUserOffer });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const applicationUserOffer: IApplicationUserOffer = { id: 456 };
      const offer: IOffer = { id: 71176 };
      applicationUserOffer.offer = offer;
      const applicationUser: IApplicationUser = { id: 32341 };
      applicationUserOffer.applicationUser = applicationUser;

      activatedRoute.data = of({ applicationUserOffer });
      comp.ngOnInit();

      expect(comp.offersSharedCollection).toContain(offer);
      expect(comp.applicationUsersSharedCollection).toContain(applicationUser);
      expect(comp.applicationUserOffer).toEqual(applicationUserOffer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUserOffer>>();
      const applicationUserOffer = { id: 123 };
      jest.spyOn(applicationUserOfferFormService, 'getApplicationUserOffer').mockReturnValue(applicationUserOffer);
      jest.spyOn(applicationUserOfferService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUserOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUserOffer }));
      saveSubject.complete();

      // THEN
      expect(applicationUserOfferFormService.getApplicationUserOffer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationUserOfferService.update).toHaveBeenCalledWith(expect.objectContaining(applicationUserOffer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUserOffer>>();
      const applicationUserOffer = { id: 123 };
      jest.spyOn(applicationUserOfferFormService, 'getApplicationUserOffer').mockReturnValue({ id: null });
      jest.spyOn(applicationUserOfferService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUserOffer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUserOffer }));
      saveSubject.complete();

      // THEN
      expect(applicationUserOfferFormService.getApplicationUserOffer).toHaveBeenCalled();
      expect(applicationUserOfferService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUserOffer>>();
      const applicationUserOffer = { id: 123 };
      jest.spyOn(applicationUserOfferService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUserOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationUserOfferService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOffer', () => {
      it('Should forward to offerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(offerService, 'compareOffer');
        comp.compareOffer(entity, entity2);
        expect(offerService.compareOffer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
