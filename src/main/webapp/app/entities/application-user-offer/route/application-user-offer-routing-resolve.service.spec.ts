import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IApplicationUserOffer } from '../application-user-offer.model';
import { ApplicationUserOfferService } from '../service/application-user-offer.service';

import { ApplicationUserOfferRoutingResolveService } from './application-user-offer-routing-resolve.service';

describe('ApplicationUserOffer routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ApplicationUserOfferRoutingResolveService;
  let service: ApplicationUserOfferService;
  let resultApplicationUserOffer: IApplicationUserOffer | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ApplicationUserOfferRoutingResolveService);
    service = TestBed.inject(ApplicationUserOfferService);
    resultApplicationUserOffer = undefined;
  });

  describe('resolve', () => {
    it('should return IApplicationUserOffer returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultApplicationUserOffer = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultApplicationUserOffer).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultApplicationUserOffer = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultApplicationUserOffer).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IApplicationUserOffer>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultApplicationUserOffer = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultApplicationUserOffer).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
