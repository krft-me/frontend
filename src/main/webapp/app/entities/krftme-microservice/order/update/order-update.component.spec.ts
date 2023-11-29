import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { from, of, Subject } from "rxjs";

import { OrderFormService } from "./order-form.service";
import { OrderService } from "../service/order.service";
import { IOrder } from "../order.model";
import {
  IApplicationUserOffer
} from "app/entities/krftme-microservice/application-user-offer/application-user-offer.model";
import {
  ApplicationUserOfferService
} from "app/entities/krftme-microservice/application-user-offer/service/application-user-offer.service";
import { IApplicationUser } from "app/entities/krftme-microservice/application-user/application-user.model";
import {
  ApplicationUserService
} from "app/entities/krftme-microservice/application-user/service/application-user.service";

import { OrderUpdateComponent } from "./order-update.component";

describe("Order Management Update Component", () => {
  let comp: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderFormService: OrderFormService;
  let orderService: OrderService;
  let applicationUserOfferService: ApplicationUserOfferService;
  let applicationUserService: ApplicationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderUpdateComponent],
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
      .overrideTemplate(OrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderFormService = TestBed.inject(OrderFormService);
    orderService = TestBed.inject(OrderService);
    applicationUserOfferService = TestBed.inject(ApplicationUserOfferService);
    applicationUserService = TestBed.inject(ApplicationUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUserOffer query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const offer: IApplicationUserOffer = { id: 44088 };
      order.offer = offer;

      const applicationUserOfferCollection: IApplicationUserOffer[] = [{ id: 50484 }];
      jest.spyOn(applicationUserOfferService, 'query"query"ReturnValue(of(new HttpResponse({ body: applicationUserOfferCollection })));
      const additionalApplicationUserOffers = [offer];
      const expectedCollection: IApplicationUserOffer[] = [...additionalApplicationUserOffers, ...applicationUserOfferCollection];
      jest.spyOn(applicationUserOfferService, 'addAp"addApplicationUserOfferToCollectionIfMissing"ReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(applicationUserOfferService.query).toHaveBeenCalled();
      expect(applicationUserOfferService.addApplicationUserOfferToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserOfferCollection,
        ...additionalApplicationUserOffers.map(expect.objectContaining)
      );
      expect(comp.applicationUserOffersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ApplicationUser query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const customer: IApplicationUser = { id: 75329 };
      order.customer = customer;

      const applicationUserCollection: IApplicationUser[] = [{ id: 45730 }];
      jest.spyOn(applicationUserService, "query").mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [customer];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, "addApplicationUserToCollectionIfMissing").mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers.map(expect.objectContaining)
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const order: IOrder = { id: 456 };
      const offer: IApplicationUserOffer = { id: 62962 };
      order.offer = offer;
      const customer: IApplicationUser = { id: 56981 };
      order.customer = customer;

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(comp.applicationUserOffersSharedCollection).toContain(offer);
      expect(comp.applicationUsersSharedCollection).toContain(customer);
      expect(comp.order).toEqual(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderFormService, 'getOrder').mockReturnValue(order);
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderFormService.getOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith(expect.objectContaining(order));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderFormService, 'getOrder').mockReturnValue({ id: null });
      jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderFormService.getOrder).toHaveBeenCalled();
      expect(orderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderService.update).toHaveBeenCalled();
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
