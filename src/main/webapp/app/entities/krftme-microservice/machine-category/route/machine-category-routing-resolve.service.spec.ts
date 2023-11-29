import { TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

import { IMachineCategory } from "../machine-category.model";
import { MachineCategoryService } from "../service/machine-category.service";

import { MachineCategoryRoutingResolveService } from "./machine-category-routing-resolve.service";

describe("MachineCategory routing resolve service", () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: MachineCategoryRoutingResolveService;
  let service: MachineCategoryService;
  let resultMachineCategory: IMachineCategory | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, "navigate").mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(MachineCategoryRoutingResolveService);
    service = TestBed.inject(MachineCategoryService);
    resultMachineCategory = undefined;
  });

  describe('resolve', () => {
    "should return IMachineCategory returned by find";
    find;
    ', () => {
    // GIVEN
    service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
    mockActivatedRouteSnapshot.params = { id: 123 };

    // WHEN
    routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
      resultMachineCategory = result;
    });

    // THEN
    expect(service.find).toBeCalledWith(123);
    expect(resultMachineCategory).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMachineCategory = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMachineCategory).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, "find").mockReturnValue(of(new HttpResponse<IMachineCategory>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMachineCategory = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMachineCategory).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(["404"]);
    });
});
})
