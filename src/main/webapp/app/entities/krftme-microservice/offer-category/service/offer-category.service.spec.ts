import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { IOfferCategory } from "../offer-category.model";
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData
} from "../offer-category.test-samples";

import { OfferCategoryService } from "./offer-category.service";

const requireRestSample: IOfferCategory = {
  ...sampleWithRequiredData
};

describe("OfferCategory Service", () => {
  let service: OfferCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IOfferCategory | IOfferCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    expectedResult = null;
    service = TestBed.inject(OfferCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe("Service methods", () => {
    it("should find an element", () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('shoul create a OfferCategory', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const offerCategory = { ...sampleWithNewData };
    const returnedFromService = { ...requireRestSample };
    const expected = { ...sampleWithRequiredData };

    service.create(offerCategory).subscribe(resp => (expectedResult = resp.body));

    const req = httpMock.expectOne({ method: "POST"});
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should update a OfferCategory", () => {
    const offerCategory = { ...sampleWithRequiredData };
    const returnedFromService = { ...requireRestSample };
    const expected = { ...sampleWithRequiredData };

    service.update(offerCategory).subscribe(resp => (expectedResult = resp.body));

    const req = httpMock.expectOne({ method: "PUT"});
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should partial update a OfferCategory", () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "PATCH" });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it("should return a list of OfferCategory", () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: "GET" });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it("should delete a OfferCategory", () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: "DELETE" });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe("addOfferCategoryToCollectionIfMissing", () => {
      it("should add a OfferCategory to an empty array", () => {
        const offerCategory: IOfferCategory = sampleWithRequiredData;
        expectedResult = service.addOfferCategoryToCollectionIfMissing([], offerCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offerCategory);
      });

      it("should not add a OfferCategory to an array that contains it", () => {
        const offerCategory: IOfferCategory = sampleWithRequiredData;
        const offerCategoryCollection: IOfferCategory[] = [
          {
            ...offerCategory
          },
          sampleWithPartialData
        ];
        expectedResult = service.addOfferCategoryToCollectionIfMissing(offerCategoryCollection, offerCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OfferCategory to an array that doesn't contain it", () => {
        const offerCategory: IOfferCategory = sampleWithRequiredData;
        const offerCategoryCollection: IOfferCategory[] = [sampleWithPartialData];
        expectedResult = service.addOfferCategoryToCollectionIfMissing(offerCategoryCollection, offerCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offerCategory);
      });

      it("should add only unique OfferCategory to an array", () => {
        const offerCategoryArray: IOfferCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const offerCategoryCollection: IOfferCategory[] = [sampleWithRequiredData];
        expectedResult = service.addOfferCategoryToCollectionIfMissing(offerCategoryCollection, ...offerCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it("should accept varargs", () => {
        const offerCategory: IOfferCategory = sampleWithRequiredData;
        const offerCategory2: IOfferCategory = sampleWithPartialData;
        expectedResult = service.addOfferCategoryToCollectionIfMissing([], offerCategory, offerCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offerCategory);
        expect(expectedResult).toContain(offerCategory2);
      });

      it("should accept null and undefined values", () => {
        const offerCategory: IOfferCategory = sampleWithRequiredData;
        expectedResult = service.addOfferCategoryToCollectionIfMissing([], null, offerCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offerCategory);
      });

      it("should return initial array if no OfferCategory is added", () => {
        const offerCategoryCollection: IOfferCategory[] = [sampleWithRequiredData];
        expectedResult = service.addOfferCategoryToCollectionIfMissing(offerCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(offerCategoryCollection);
      });
    });

    describe("compareOfferCategory", () => {
      it("Should return true if both entities are null", () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOfferCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it("Should return false if one entity is null", () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOfferCategory(entity1, entity2);
        const compareResult2 = service.compareOfferCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it("Should return false if primaryKey differs", () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOfferCategory(entity1, entity2);
        const compareResult2 = service.compareOfferCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it("Should return false if primaryKey matches", () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOfferCategory(entity1, entity2);
        const compareResult2 = service.compareOfferCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
