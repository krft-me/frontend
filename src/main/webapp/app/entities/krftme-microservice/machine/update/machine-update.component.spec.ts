import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, of, Subject } from 'rxjs';

import { MachineFormService } from './machine-form.service';
import { MachineService } from '../service/machine.service';
import { IMachine } from '../machine.model';
import { IMachineCategory } from 'app/entities/krftme-microservice/machine-category/machine-category.model';
import { MachineCategoryService } from 'app/entities/krftme-microservice/machine-category/service/machine-category.service';

import { MachineUpdateComponent } from './machine-update.component';

describe('Machine Management Update Component', () => {
  let comp: MachineUpdateComponent;
  let fixture: ComponentFixture<MachineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let machineFormService: MachineFormService;
  let machineService: MachineService;
  let machineCategoryService: MachineCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MachineUpdateComponent],
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
      .overrideTemplate(MachineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MachineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    machineFormService = TestBed.inject(MachineFormService);
    machineService = TestBed.inject(MachineService);
    machineCategoryService = TestBed.inject(MachineCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call MachineCategory query and add missing value', () => {
      const machine: IMachine = { id: 456 };
      const category: IMachineCategory = { id: 4111 };
      machine.category = category;

      const machineCategoryCollection: IMachineCategory[] = [{ id: 80788 }];
      jest.spyOn(machineCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: machineCategoryCollection })));
      const additionalMachineCategories = [category];
      const expectedCollection: IMachineCategory[] = [...additionalMachineCategories, ...machineCategoryCollection];
      jest.spyOn(machineCategoryService, 'addMachineCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      expect(machineCategoryService.query).toHaveBeenCalled();
      expect(machineCategoryService.addMachineCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        machineCategoryCollection,
        ...additionalMachineCategories.map(expect.objectContaining)
      );
      expect(comp.machineCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const machine: IMachine = { id: 456 };
      const category: IMachineCategory = { id: 11107 };
      machine.category = category;

      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      expect(comp.machineCategoriesSharedCollection).toContain(category);
      expect(comp.machine).toEqual(machine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachine>>();
      const machine = { id: 123 };
      jest.spyOn(machineFormService, 'getMachine').mockReturnValue(machine);
      jest.spyOn(machineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: machine }));
      saveSubject.complete();

      // THEN
      expect(machineFormService.getMachine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(machineService.update).toHaveBeenCalledWith(expect.objectContaining(machine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachine>>();
      const machine = { id: 123 };
      jest.spyOn(machineFormService, 'getMachine').mockReturnValue({ id: null });
      jest.spyOn(machineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: machine }));
      saveSubject.complete();

      // THEN
      expect(machineFormService.getMachine).toHaveBeenCalled();
      expect(machineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachine>>();
      const machine = { id: 123 };
      jest.spyOn(machineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(machineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMachineCategory', () => {
      it('Should forward to machineCategoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(machineCategoryService, 'compareMachineCategory');
        comp.compareMachineCategory(entity, entity2);
        expect(machineCategoryService.compareMachineCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
