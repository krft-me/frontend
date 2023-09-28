import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShowcaseFormService } from './showcase-form.service';
import { ShowcaseService } from '../service/showcase.service';
import { IShowcase } from '../showcase.model';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/application-user-offer/service/application-user-offer.service';

import { ShowcaseUpdateComponent } from './showcase-update.component';

describe('Showcase Management Update Component', () => {
  let comp: ShowcaseUpdateComponent;
  let fixture: ComponentFixture<ShowcaseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let showcaseFormService: ShowcaseFormService;
  let showcaseService: ShowcaseService;
  let applicationUserOfferService: ApplicationUserOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShowcaseUpdateComponent],
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
      .overrideTemplate(ShowcaseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShowcaseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    showcaseFormService = TestBed.inject(ShowcaseFormService);
    showcaseService = TestBed.inject(ShowcaseService);
    applicationUserOfferService = TestBed.inject(ApplicationUserOfferService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUserOffer query and add missing value', () => {
      const showcase: IShowcase = { id: 456 };
      const applicationUserOffer: IApplicationUserOffer = { id: 60134 };
      showcase.applicationUserOffer = applicationUserOffer;

      const applicationUserOfferCollection: IApplicationUserOffer[] = [{ id: 15258 }];
      jest.spyOn(applicationUserOfferService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserOfferCollection })));
      const additionalApplicationUserOffers = [applicationUserOffer];
      const expectedCollection: IApplicationUserOffer[] = [...additionalApplicationUserOffers, ...applicationUserOfferCollection];
      jest.spyOn(applicationUserOfferService, 'addApplicationUserOfferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ showcase });
      comp.ngOnInit();

      expect(applicationUserOfferService.query).toHaveBeenCalled();
      expect(applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserOfferCollection,
        ...additionalApplicationUserOffers.map(expect.objectContaining)
      );
      expect(comp.applicationUserOffersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const showcase: IShowcase = { id: 456 };
      const applicationUserOffer: IApplicationUserOffer = { id: 55876 };
      showcase.applicationUserOffer = applicationUserOffer;

      activatedRoute.data = of({ showcase });
      comp.ngOnInit();

      expect(comp.applicationUserOffersSharedCollection).toContain(applicationUserOffer);
      expect(comp.showcase).toEqual(showcase);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShowcase>>();
      const showcase = { id: 123 };
      jest.spyOn(showcaseFormService, 'getShowcase').mockReturnValue(showcase);
      jest.spyOn(showcaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ showcase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: showcase }));
      saveSubject.complete();

      // THEN
      expect(showcaseFormService.getShowcase).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(showcaseService.update).toHaveBeenCalledWith(expect.objectContaining(showcase));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShowcase>>();
      const showcase = { id: 123 };
      jest.spyOn(showcaseFormService, 'getShowcase').mockReturnValue({ id: null });
      jest.spyOn(showcaseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ showcase: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: showcase }));
      saveSubject.complete();

      // THEN
      expect(showcaseFormService.getShowcase).toHaveBeenCalled();
      expect(showcaseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShowcase>>();
      const showcase = { id: 123 };
      jest.spyOn(showcaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ showcase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(showcaseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicationUserOffer', () => {
      it('Should forward to applicationUserOfferService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserOfferService, 'compareApplicationUserOffer');
        comp.compareApplicationUserOffer(entity, entity2);
        expect(applicationUserOfferService.compareApplicationUserOffer).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
