import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RatingFormService } from './rating-form.service';
import { RatingService } from '../service/rating.service';
import { IRating } from '../rating.model';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/application-user-offer/service/application-user-offer.service';

import { RatingUpdateComponent } from './rating-update.component';

describe('Rating Management Update Component', () => {
  let comp: RatingUpdateComponent;
  let fixture: ComponentFixture<RatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ratingFormService: RatingFormService;
  let ratingService: RatingService;
  let applicationUserOfferService: ApplicationUserOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RatingUpdateComponent],
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
      .overrideTemplate(RatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ratingFormService = TestBed.inject(RatingFormService);
    ratingService = TestBed.inject(RatingService);
    applicationUserOfferService = TestBed.inject(ApplicationUserOfferService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUserOffer query and add missing value', () => {
      const rating: IRating = { id: 456 };
      const applicationUserOffer: IApplicationUserOffer = { id: 17498 };
      rating.applicationUserOffer = applicationUserOffer;

      const applicationUserOfferCollection: IApplicationUserOffer[] = [{ id: 32970 }];
      jest.spyOn(applicationUserOfferService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserOfferCollection })));
      const additionalApplicationUserOffers = [applicationUserOffer];
      const expectedCollection: IApplicationUserOffer[] = [...additionalApplicationUserOffers, ...applicationUserOfferCollection];
      jest.spyOn(applicationUserOfferService, 'addApplicationUserOfferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(applicationUserOfferService.query).toHaveBeenCalled();
      expect(applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserOfferCollection,
        ...additionalApplicationUserOffers.map(expect.objectContaining)
      );
      expect(comp.applicationUserOffersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rating: IRating = { id: 456 };
      const applicationUserOffer: IApplicationUserOffer = { id: 79982 };
      rating.applicationUserOffer = applicationUserOffer;

      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      expect(comp.applicationUserOffersSharedCollection).toContain(applicationUserOffer);
      expect(comp.rating).toEqual(rating);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingFormService, 'getRating').mockReturnValue(rating);
      jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rating }));
      saveSubject.complete();

      // THEN
      expect(ratingFormService.getRating).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ratingService.update).toHaveBeenCalledWith(expect.objectContaining(rating));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingFormService, 'getRating').mockReturnValue({ id: null });
      jest.spyOn(ratingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rating }));
      saveSubject.complete();

      // THEN
      expect(ratingFormService.getRating).toHaveBeenCalled();
      expect(ratingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRating>>();
      const rating = { id: 123 };
      jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ratingService.update).toHaveBeenCalled();
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
