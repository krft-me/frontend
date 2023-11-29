import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffer } from '../offer.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../offer.test-samples';

import { OfferService } from './offer.service';

const requireRestSample: IOffer = {
  ...sampleWithRequiredData,
};

describe('Offer Service', () => {
  let service: OfferService;
  let httpMock: HttpTestingController;
  let expectedResult: IOffer | IOffer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OfferService);
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

    it('should create a Offer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const offer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(offer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Offer', () => {
      const offer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(offer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Offer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Offer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Offer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOfferToCollectionIfMissing', () => {
      it('should add a Offer to an empty array', () => {
        const offer: IOffer = sampleWithRequiredData;
        expectedResult = service.addOfferToCollectionIfMissing([], offer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offer);
      });

      it('should not add a Offer to an array that contains it', () => {
        const offer: IOffer = sampleWithRequiredData;
        const offerCollection: IOffer[] = [
          {
            ...offer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, offer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Offer to an array that doesn't contain it", () => {
        const offer: IOffer = sampleWithRequiredData;
        const offerCollection: IOffer[] = [sampleWithPartialData];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, offer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offer);
      });

      it('should add only unique Offer to an array', () => {
        const offerArray: IOffer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const offerCollection: IOffer[] = [sampleWithRequiredData];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, ...offerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offer: IOffer = sampleWithRequiredData;
        const offer2: IOffer = sampleWithPartialData;
        expectedResult = service.addOfferToCollectionIfMissing([], offer, offer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offer);
        expect(expectedResult).toContain(offer2);
      });

      it('should accept null and undefined values', () => {
        const offer: IOffer = sampleWithRequiredData;
        expectedResult = service.addOfferToCollectionIfMissing([], null, offer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offer);
      });

      it('should return initial array if no Offer is added', () => {
        const offerCollection: IOffer[] = [sampleWithRequiredData];
        expectedResult = service.addOfferToCollectionIfMissing(offerCollection, undefined, null);
        expect(expectedResult).toEqual(offerCollection);
      });
    });

    describe('compareOffer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOffer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOffer(entity1, entity2);
        const compareResult2 = service.compareOffer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOffer(entity1, entity2);
        const compareResult2 = service.compareOffer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOffer(entity1, entity2);
        const compareResult2 = service.compareOffer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
