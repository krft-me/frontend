import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, of, Subject } from 'rxjs';

import { OfferCategoryFormService } from './offer-category-form.service';
import { OfferCategoryService } from '../service/offer-category.service';
import { IOfferCategory } from '../offer-category.model';

import { OfferCategoryUpdateComponent } from './offer-category-update.component';

describe('OfferCategory Management Update Component', () => {
  let comp: OfferCategoryUpdateComponent;
  let fixture: ComponentFixture<OfferCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offerCategoryFormService: OfferCategoryFormService;
  let offerCategoryService: OfferCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OfferCategoryUpdateComponent],
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
      .overrideTemplate(OfferCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offerCategoryFormService = TestBed.inject(OfferCategoryFormService);
    offerCategoryService = TestBed.inject(OfferCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const offerCategory: IOfferCategory = { id: 456 };

      activatedRoute.data = of({ offerCategory });
      comp.ngOnInit();

      expect(comp.offerCategory).toEqual(offerCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOfferCategory>>();
      const offerCategory = { id: 123 };
      jest.spyOn(offerCategoryFormService, 'getOfferCategory').mockReturnValue(offerCategory);
      jest.spyOn(offerCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offerCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offerCategory }));
      saveSubject.complete();

      // THEN
      expect(offerCategoryFormService.getOfferCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(offerCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(offerCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOfferCategory>>();
      const offerCategory = { id: 123 };
      jest.spyOn(offerCategoryFormService, 'getOfferCategory').mockReturnValue({ id: null });
      jest.spyOn(offerCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offerCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offerCategory }));
      saveSubject.complete();

      // THEN
      expect(offerCategoryFormService.getOfferCategory).toHaveBeenCalled();
      expect(offerCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOfferCategory>>();
      const offerCategory = { id: 123 };
      jest.spyOn(offerCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offerCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offerCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
