import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IApplicationUserOffer } from '../application-user-offer.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../application-user-offer.test-samples';

import { ApplicationUserOfferService } from './application-user-offer.service';

const requireRestSample: IApplicationUserOffer = {
  ...sampleWithRequiredData,
};

describe('ApplicationUserOffer Service', () => {
  let service: ApplicationUserOfferService;
  let httpMock: HttpTestingController;
  let expectedResult: IApplicationUserOffer | IApplicationUserOffer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ApplicationUserOfferService);
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

    it('should create a ApplicationUserOffer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const applicationUserOffer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(applicationUserOffer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ApplicationUserOffer', () => {
      const applicationUserOffer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(applicationUserOffer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ApplicationUserOffer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ApplicationUserOffer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ApplicationUserOffer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addApplicationUserOfferToCollectionIfMissing', () => {
      it('should add a ApplicationUserOffer to an empty array', () => {
        const applicationUserOffer: IApplicationUserOffer = sampleWithRequiredData;
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing([], applicationUserOffer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(applicationUserOffer);
      });

      it('should not add a ApplicationUserOffer to an array that contains it', () => {
        const applicationUserOffer: IApplicationUserOffer = sampleWithRequiredData;
        const applicationUserOfferCollection: IApplicationUserOffer[] = [
          {
            ...applicationUserOffer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing(applicationUserOfferCollection, applicationUserOffer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ApplicationUserOffer to an array that doesn't contain it", () => {
        const applicationUserOffer: IApplicationUserOffer = sampleWithRequiredData;
        const applicationUserOfferCollection: IApplicationUserOffer[] = [sampleWithPartialData];
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing(applicationUserOfferCollection, applicationUserOffer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(applicationUserOffer);
      });

      it('should add only unique ApplicationUserOffer to an array', () => {
        const applicationUserOfferArray: IApplicationUserOffer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const applicationUserOfferCollection: IApplicationUserOffer[] = [sampleWithRequiredData];
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing(applicationUserOfferCollection, ...applicationUserOfferArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const applicationUserOffer: IApplicationUserOffer = sampleWithRequiredData;
        const applicationUserOffer2: IApplicationUserOffer = sampleWithPartialData;
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing([], applicationUserOffer, applicationUserOffer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(applicationUserOffer);
        expect(expectedResult).toContain(applicationUserOffer2);
      });

      it('should accept null and undefined values', () => {
        const applicationUserOffer: IApplicationUserOffer = sampleWithRequiredData;
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing([], null, applicationUserOffer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(applicationUserOffer);
      });

      it('should return initial array if no ApplicationUserOffer is added', () => {
        const applicationUserOfferCollection: IApplicationUserOffer[] = [sampleWithRequiredData];
        expectedResult = service.addApplicationUserOfferToCollectionIfMissing(applicationUserOfferCollection, undefined, null);
        expect(expectedResult).toEqual(applicationUserOfferCollection);
      });
    });

    describe('compareApplicationUserOffer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareApplicationUserOffer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareApplicationUserOffer(entity1, entity2);
        const compareResult2 = service.compareApplicationUserOffer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareApplicationUserOffer(entity1, entity2);
        const compareResult2 = service.compareApplicationUserOffer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareApplicationUserOffer(entity1, entity2);
        const compareResult2 = service.compareApplicationUserOffer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
