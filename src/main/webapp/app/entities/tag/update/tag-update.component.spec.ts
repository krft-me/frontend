import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TagFormService } from './tag-form.service';
import { TagService } from '../service/tag.service';
import { ITag } from '../tag.model';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { ApplicationUserOfferService } from 'app/entities/application-user-offer/service/application-user-offer.service';

import { TagUpdateComponent } from './tag-update.component';

describe('Tag Management Update Component', () => {
  let comp: TagUpdateComponent;
  let fixture: ComponentFixture<TagUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tagFormService: TagFormService;
  let tagService: TagService;
  let applicationUserOfferService: ApplicationUserOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TagUpdateComponent],
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
      .overrideTemplate(TagUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TagUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tagFormService = TestBed.inject(TagFormService);
    tagService = TestBed.inject(TagService);
    applicationUserOfferService = TestBed.inject(ApplicationUserOfferService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUserOffer query and add missing value', () => {
      const tag: ITag = { id: 456 };
      const applicationUserOffer: IApplicationUserOffer = { id: 85098 };
      tag.applicationUserOffer = applicationUserOffer;

      const applicationUserOfferCollection: IApplicationUserOffer[] = [{ id: 83325 }];
      jest.spyOn(applicationUserOfferService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserOfferCollection })));
      const additionalApplicationUserOffers = [applicationUserOffer];
      const expectedCollection: IApplicationUserOffer[] = [...additionalApplicationUserOffers, ...applicationUserOfferCollection];
      jest.spyOn(applicationUserOfferService, 'addApplicationUserOfferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(applicationUserOfferService.query).toHaveBeenCalled();
      expect(applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserOfferCollection,
        ...additionalApplicationUserOffers.map(expect.objectContaining)
      );
      expect(comp.applicationUserOffersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tag: ITag = { id: 456 };
      const applicationUserOffer: IApplicationUserOffer = { id: 37827 };
      tag.applicationUserOffer = applicationUserOffer;

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(comp.applicationUserOffersSharedCollection).toContain(applicationUserOffer);
      expect(comp.tag).toEqual(tag);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagFormService, 'getTag').mockReturnValue(tag);
      jest.spyOn(tagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tag }));
      saveSubject.complete();

      // THEN
      expect(tagFormService.getTag).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tagService.update).toHaveBeenCalledWith(expect.objectContaining(tag));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagFormService, 'getTag').mockReturnValue({ id: null });
      jest.spyOn(tagService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tag }));
      saveSubject.complete();

      // THEN
      expect(tagFormService.getTag).toHaveBeenCalled();
      expect(tagService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tagService.update).toHaveBeenCalled();
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
