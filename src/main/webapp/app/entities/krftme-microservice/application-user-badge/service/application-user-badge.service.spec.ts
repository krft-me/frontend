import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { IApplicationUserBadge } from "../application-user-badge.model";
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData
} from "../application-user-badge.test-samples";

import { ApplicationUserBadgeService, RestApplicationUserBadge } from "./application-user-badge.service";

const requireRestSample: RestApplicationUserBadge = {
  ...sampleWithRequiredData,
  obtainedDate: sampleWithRequiredData.obtainedDate?.toJSON(,
};

describe('ApplicationUserBadge Service', () => {
  let service: ApplicationUserBadgeService;
  let httpMock: HttpTestingController;
  let expectedResult: IApplicationUserBadge | IApplicationUserBadge[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ApplicationUserBadgeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ApplicationUserBadge', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const applicationUserBadge = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(applicationUserBadge).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ApplicationUserBadge', () => {
      const applicationUserBadge = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(applicationUserBadge).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ApplicationUserBadge', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ApplicationUserBadge', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ApplicationUserBadge', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addApplicationUserBadgeToCollectionIfMissing', () => {
      it('should add a ApplicationUserBadge to an empty array', () => {
        const applicationUserBadge: IApplicationUserBadge = sampleWithRequiredData;
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing([], applicationUserBadge);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(applicationUserBadge);
      });

      it('should not add a ApplicationUserBadge to an array that contains it', () => {
        const applicationUserBadge: IApplicationUserBadge = sampleWithRequiredData;
        const applicationUserBadgeCollection: IApplicationUserBadge[] = [
          {
            ...applicationUserBadge,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing(applicationUserBadgeCollection, applicationUserBadge);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ApplicationUserBadge to an array that doesn't contain it", () => {
        const applicationUserBadge: IApplicationUserBadge = sampleWithRequiredData;
        const applicationUserBadgeCollection: IApplicationUserBadge[] = [sampleWithPartialData];
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing(applicationUserBadgeCollection, applicationUserBadge);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(applicationUserBadge);
      });

      it('should add only unique ApplicationUserBadge to an array', () => {
        const applicationUserBadgeArray: IApplicationUserBadge[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const applicationUserBadgeCollection: IApplicationUserBadge[] = [sampleWithRequiredData];
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing(applicationUserBadgeCollection, ...applicationUserBadgeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const applicationUserBadge: IApplicationUserBadge = sampleWithRequiredData;
        const applicationUserBadge2: IApplicationUserBadge = sampleWithPartialData;
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing([], applicationUserBadge, applicationUserBadge2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(applicationUserBadge);
        expect(expectedResult).toContain(applicationUserBadge2);
      });

      it('should accept null and undefined values', () => {
        const applicationUserBadge: IApplicationUserBadge = sampleWithRequiredData;
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing([], null, applicationUserBadge, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(applicationUserBadge);
      });

      it('should return initial array if no ApplicationUserBadge is added', () => {
        const applicationUserBadgeCollection: IApplicationUserBadge[] = [sampleWithRequiredData];
        expectedResult = service.addApplicationUserBadgeToCollectionIfMissing(applicationUserBadgeCollection, undefined, null);
        expect(expectedResult).toEqual(applicationUserBadgeCollection);
      });
    });

    describe('compareApplicationUserBadge', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareApplicationUserBadge(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareApplicationUserBadge(entity1, entity2);
        const compareResult2 = service.compareApplicationUserBadge(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareApplicationUserBadge(entity1, entity2);
        const compareResult2 = service.compareApplicationUserBadge(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareApplicationUserBadge(entity1, entity2);
        const compareResult2 = service.compareApplicationUserBadge(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
