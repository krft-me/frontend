import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShowcase } from '../showcase.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../showcase.test-samples';

import { ShowcaseService } from './showcase.service';

const requireRestSample: IShowcase = {
  ...sampleWithRequiredData,
};

describe('Showcase Service', () => {
  let service: ShowcaseService;
  let httpMock: HttpTestingController;
  let expectedResult: IShowcase | IShowcase[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShowcaseService);
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

    it('should create a Showcase', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const showcase = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(showcase).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Showcase', () => {
      const showcase = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(showcase).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Showcase', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Showcase', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Showcase', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShowcaseToCollectionIfMissing', () => {
      it('should add a Showcase to an empty array', () => {
        const showcase: IShowcase = sampleWithRequiredData;
        expectedResult = service.addShowcaseToCollectionIfMissing([], showcase);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(showcase);
      });

      it('should not add a Showcase to an array that contains it', () => {
        const showcase: IShowcase = sampleWithRequiredData;
        const showcaseCollection: IShowcase[] = [
          {
            ...showcase,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShowcaseToCollectionIfMissing(showcaseCollection, showcase);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Showcase to an array that doesn't contain it", () => {
        const showcase: IShowcase = sampleWithRequiredData;
        const showcaseCollection: IShowcase[] = [sampleWithPartialData];
        expectedResult = service.addShowcaseToCollectionIfMissing(showcaseCollection, showcase);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(showcase);
      });

      it('should add only unique Showcase to an array', () => {
        const showcaseArray: IShowcase[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const showcaseCollection: IShowcase[] = [sampleWithRequiredData];
        expectedResult = service.addShowcaseToCollectionIfMissing(showcaseCollection, ...showcaseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const showcase: IShowcase = sampleWithRequiredData;
        const showcase2: IShowcase = sampleWithPartialData;
        expectedResult = service.addShowcaseToCollectionIfMissing([], showcase, showcase2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(showcase);
        expect(expectedResult).toContain(showcase2);
      });

      it('should accept null and undefined values', () => {
        const showcase: IShowcase = sampleWithRequiredData;
        expectedResult = service.addShowcaseToCollectionIfMissing([], null, showcase, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(showcase);
      });

      it('should return initial array if no Showcase is added', () => {
        const showcaseCollection: IShowcase[] = [sampleWithRequiredData];
        expectedResult = service.addShowcaseToCollectionIfMissing(showcaseCollection, undefined, null);
        expect(expectedResult).toEqual(showcaseCollection);
      });
    });

    describe('compareShowcase', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShowcase(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShowcase(entity1, entity2);
        const compareResult2 = service.compareShowcase(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShowcase(entity1, entity2);
        const compareResult2 = service.compareShowcase(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShowcase(entity1, entity2);
        const compareResult2 = service.compareShowcase(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
