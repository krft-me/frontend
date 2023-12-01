import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { from, of, Subject } from "rxjs";

import { ApplicationUserBadgeFormService } from "./application-user-badge-form.service";
import { ApplicationUserBadgeService } from "../service/application-user-badge.service";
import { IApplicationUserBadge } from "../application-user-badge.model";
import { IApplicationUser } from "app/entities/krftme-microservice/application-user/application-user.model";
import {
  ApplicationUserService
} from "app/entities/krftme-microservice/application-user/service/application-user.service";
import { IBadge } from "app/entities/krftme-microservice/badge/badge.model";
import { BadgeService } from "app/entities/krftme-microservice/badge/service/badge.service";

import { ApplicationUserBadgeUpdateComponent } from "./application-user-badge-update.component";

describe("ApplicationUserBadge Management Update Component", () => {
  let comp: ApplicationUserBadgeUpdateComponent;
  let fixture: ComponentFixture<ApplicationUserBadgeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let applicationUserBadgeFormService: ApplicationUserBadgeFormService;
  let applicationUserBadgeService: ApplicationUserBadgeService;
  let applicationUserService: ApplicationUserService;
  let badgeService: BadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ApplicationUserBadgeUpdateComponent],
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
      .overrideTemplate(ApplicationUserBadgeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationUserBadgeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationUserBadgeFormService = TestBed.inject(ApplicationUserBadgeFormService);
    applicationUserBadgeService = TestBed.inject(ApplicationUserBadgeService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    badgeService = TestBed.inject(BadgeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const applicationUserBadge: IApplicationUserBadge = { id: 456 };
      const user: IApplicationUser = { id: 57536 };
      applicationUserBadge.user = user;

      const applicationUserCollection: IApplicationUser[] = [{ id: 28291 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [user];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUserBadge });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Badge query and add missing value', () => {
      const applicationUserBadge: IApplicationUserBadge = { id: 456 };
      const badge: IBadge = { id: 2511 };
      applicationUserBadge.badge = badge;

      const badgeCollection: IBadge[] = [{ id: 25742 }];
      jest.spyOn(badgeService, 'query').mockReturnValue(of(new HttpResponse({ body: badgeCollection })));
      const additionalBadges = [badge];
      const expectedCollection: IBadge[] = [...additionalBadges, ...badgeCollection];
      jest.spyOn(badgeService, 'addBadgeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ applicationUserBadge });
      comp.ngOnInit();

      expect(badgeService.query).toHaveBeenCalled();
      expect(badgeService.addBadgeToCollectionIfMissing).toHaveBeenCalledWith(
        badgeCollection,
        ...additionalBadges.map(expect.objectContaining)
      );
      expect(comp.badgesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const applicationUserBadge: IApplicationUserBadge = { id: 456 };
      const user: IApplicationUser = { id: 32656 };
      applicationUserBadge.user = user;
      const badge: IBadge = { id: 40256 };
      applicationUserBadge.badge = badge;

      activatedRoute.data = of({ applicationUserBadge });
      comp.ngOnInit();

      expect(comp.applicationUsersSharedCollection).toContain(user);
      expect(comp.badgesSharedCollection).toContain(badge);
      expect(comp.applicationUserBadge).toEqual(applicationUserBadge);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUserBadge>>();
      const applicationUserBadge = { id: 123 };
      jest.spyOn(applicationUserBadgeFormService, 'getApplicationUserBadge').mockReturnValue(applicationUserBadge);
      jest.spyOn(applicationUserBadgeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUserBadge });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUserBadge }));
      saveSubject.complete();

      // THEN
      expect(applicationUserBadgeFormService.getApplicationUserBadge).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationUserBadgeService.update).toHaveBeenCalledWith(expect.objectContaining(applicationUserBadge));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUserBadge>>();
      const applicationUserBadge = { id: 123 };
      jest.spyOn(applicationUserBadgeFormService, 'getApplicationUserBadge').mockReturnValue({ id: null });
      jest.spyOn(applicationUserBadgeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUserBadge: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationUserBadge }));
      saveSubject.complete();

      // THEN
      expect(applicationUserBadgeFormService.getApplicationUserBadge).toHaveBeenCalled();
      expect(applicationUserBadgeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationUserBadge>>();
      const applicationUserBadge = { id: 123 };
      jest.spyOn(applicationUserBadgeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationUserBadge });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationUserBadgeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicationUser', () => {
      it('Should forward to applicationUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationUserService, 'compareApplicationUser');
        comp.compareApplicationUser(entity, entity2);
        expect(applicationUserService.compareApplicationUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBadge', () => {
      it('Should forward to badgeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(badgeService, 'compareBadge');
        comp.compareBadge(entity, entity2);
        expect(badgeService.compareBadge).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
