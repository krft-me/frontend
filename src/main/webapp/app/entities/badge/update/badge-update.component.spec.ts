import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BadgeFormService } from './badge-form.service';
import { BadgeService } from '../service/badge.service';
import { IBadge } from '../badge.model';

import { BadgeUpdateComponent } from './badge-update.component';

describe('Badge Management Update Component', () => {
  let comp: BadgeUpdateComponent;
  let fixture: ComponentFixture<BadgeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let badgeFormService: BadgeFormService;
  let badgeService: BadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BadgeUpdateComponent],
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
      .overrideTemplate(BadgeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BadgeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    badgeFormService = TestBed.inject(BadgeFormService);
    badgeService = TestBed.inject(BadgeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const badge: IBadge = { id: 456 };

      activatedRoute.data = of({ badge });
      comp.ngOnInit();

      expect(comp.badge).toEqual(badge);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBadge>>();
      const badge = { id: 123 };
      jest.spyOn(badgeFormService, 'getBadge').mockReturnValue(badge);
      jest.spyOn(badgeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ badge });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: badge }));
      saveSubject.complete();

      // THEN
      expect(badgeFormService.getBadge).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(badgeService.update).toHaveBeenCalledWith(expect.objectContaining(badge));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBadge>>();
      const badge = { id: 123 };
      jest.spyOn(badgeFormService, 'getBadge').mockReturnValue({ id: null });
      jest.spyOn(badgeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ badge: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: badge }));
      saveSubject.complete();

      // THEN
      expect(badgeFormService.getBadge).toHaveBeenCalled();
      expect(badgeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBadge>>();
      const badge = { id: 123 };
      jest.spyOn(badgeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ badge });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(badgeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
