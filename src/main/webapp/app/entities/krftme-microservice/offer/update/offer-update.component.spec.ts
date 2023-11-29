import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, of, Subject } from 'rxjs';

import { OfferFormService } from './offer-form.service';
import { OfferService } from '../service/offer.service';
import { IOffer } from '../offer.model';
import { IMachine } from 'app/entities/krftme-microservice/machine/machine.model';
import { MachineService } from 'app/entities/krftme-microservice/machine/service/machine.service';
import { IOfferCategory } from 'app/entities/krftme-microservice/offer-category/offer-category.model';
import { OfferCategoryService } from 'app/entities/krftme-microservice/offer-category/service/offer-category.service';

import { OfferUpdateComponent } from './offer-update.component';

describe('Offer Management Update Component', () => {
  let comp: OfferUpdateComponent;
  let fixture: ComponentFixture<OfferUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offerFormService: OfferFormService;
  let offerService: OfferService;
  let machineService: MachineService;
  let offerCategoryService: OfferCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OfferUpdateComponent],
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
      .overrideTemplate(OfferUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offerFormService = TestBed.inject(OfferFormService);
    offerService = TestBed.inject(OfferService);
    machineService = TestBed.inject(MachineService);
    offerCategoryService = TestBed.inject(OfferCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Machine query and add missing value', () => {
      const offer: IOffer = { id: 456 };
      const machine: IMachine = { id: 66323 };
      offer.machine = machine;

      const machineCollection: IMachine[] = [{ id: 30785 }];
      jest.spyOn(machineService, 'query').mockReturnValue(of(new HttpResponse({ body: machineCollection })));
      const additionalMachines = [machine];
      const expectedCollection: IMachine[] = [...additionalMachines, ...machineCollection];
      jest.spyOn(machineService, 'addMachineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      expect(machineService.query).toHaveBeenCalled();
      expect(machineService.addMachineToCollectionIfMissing).toHaveBeenCalledWith(
        machineCollection,
        ...additionalMachines.map(expect.objectContaining)
      );
      expect(comp.machinesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call OfferCategory query and add missing value', () => {
      const offer: IOffer = { id: 456 };
      const category: IOfferCategory = { id: 32394 };
      offer.category = category;

      const offerCategoryCollection: IOfferCategory[] = [{ id: 94582 }];
      jest.spyOn(offerCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: offerCategoryCollection })));
      const additionalOfferCategories = [category];
      const expectedCollection: IOfferCategory[] = [...additionalOfferCategories, ...offerCategoryCollection];
      jest.spyOn(offerCategoryService, 'addOfferCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      expect(offerCategoryService.query).toHaveBeenCalled();
      expect(offerCategoryService.addOfferCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        offerCategoryCollection,
        ...additionalOfferCategories.map(expect.objectContaining)
      );
      expect(comp.offerCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offer: IOffer = { id: 456 };
      const machine: IMachine = { id: 53656 };
      offer.machine = machine;
      const category: IOfferCategory = { id: 65377 };
      offer.category = category;

      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      expect(comp.machinesSharedCollection).toContain(machine);
      expect(comp.offerCategoriesSharedCollection).toContain(category);
      expect(comp.offer).toEqual(offer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffer>>();
      const offer = { id: 123 };
      jest.spyOn(offerFormService, 'getOffer').mockReturnValue(offer);
      jest.spyOn(offerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offer }));
      saveSubject.complete();

      // THEN
      expect(offerFormService.getOffer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(offerService.update).toHaveBeenCalledWith(expect.objectContaining(offer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffer>>();
      const offer = { id: 123 };
      jest.spyOn(offerFormService, 'getOffer').mockReturnValue({ id: null });
      jest.spyOn(offerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offer }));
      saveSubject.complete();

      // THEN
      expect(offerFormService.getOffer).toHaveBeenCalled();
      expect(offerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffer>>();
      const offer = { id: 123 };
      jest.spyOn(offerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMachine', () => {
      it('Should forward to machineService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(machineService, 'compareMachine');
        comp.compareMachine(entity, entity2);
        expect(machineService.compareMachine).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOfferCategory', () => {
      it('Should forward to offerCategoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(offerCategoryService, 'compareOfferCategory');
        comp.compareOfferCategory(entity, entity2);
        expect(offerCategoryService.compareOfferCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
