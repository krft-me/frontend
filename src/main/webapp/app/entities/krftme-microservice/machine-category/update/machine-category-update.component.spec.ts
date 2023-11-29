import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, of, Subject } from 'rxjs';

import { MachineCategoryFormService } from './machine-category-form.service';
import { MachineCategoryService } from '../service/machine-category.service';
import { IMachineCategory } from '../machine-category.model';

import { MachineCategoryUpdateComponent } from './machine-category-update.component';

describe('MachineCategory Management Update Component', () => {
  let comp: MachineCategoryUpdateComponent;
  let fixture: ComponentFixture<MachineCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let machineCategoryFormService: MachineCategoryFormService;
  let machineCategoryService: MachineCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MachineCategoryUpdateComponent],
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
      .overrideTemplate(MachineCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MachineCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    machineCategoryFormService = TestBed.inject(MachineCategoryFormService);
    machineCategoryService = TestBed.inject(MachineCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const machineCategory: IMachineCategory = { id: 456 };

      activatedRoute.data = of({ machineCategory });
      comp.ngOnInit();

      expect(comp.machineCategory).toEqual(machineCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachineCategory>>();
      const machineCategory = { id: 123 };
      jest.spyOn(machineCategoryFormService, 'getMachineCategory').mockReturnValue(machineCategory);
      jest.spyOn(machineCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machineCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: machineCategory }));
      saveSubject.complete();

      // THEN
      expect(machineCategoryFormService.getMachineCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(machineCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(machineCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachineCategory>>();
      const machineCategory = { id: 123 };
      jest.spyOn(machineCategoryFormService, 'getMachineCategory').mockReturnValue({ id: null });
      jest.spyOn(machineCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machineCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: machineCategory }));
      saveSubject.complete();

      // THEN
      expect(machineCategoryFormService.getMachineCategory).toHaveBeenCalled();
      expect(machineCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachineCategory>>();
      const machineCategory = { id: 123 };
      jest.spyOn(machineCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machineCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(machineCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
