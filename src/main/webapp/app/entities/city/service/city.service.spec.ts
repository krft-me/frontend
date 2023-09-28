import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICity } from '../city.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../city.test-samples';

import { CityService } from './city.service';

const requireRestSample: ICity = {
  ...sampleWithRequiredData,
};

describe('City Service', () => {
  let service: CityService;
  let httpMock: HttpTestingController;
  let expectedResult: ICity | ICity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CityService);
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

    it('should create a City', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const city = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(city).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a City', () => {
      const city = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(city).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a City', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of City', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a City', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCityToCollectionIfMissing', () => {
      it('should add a City to an empty array', () => {
        const city: ICity = sampleWithRequiredData;
        expectedResult = service.addCityToCollectionIfMissing([], city);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(city);
      });

      it('should not add a City to an array that contains it', () => {
        const city: ICity = sampleWithRequiredData;
        const cityCollection: ICity[] = [
          {
            ...city,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCityToCollectionIfMissing(cityCollection, city);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a City to an array that doesn't contain it", () => {
        const city: ICity = sampleWithRequiredData;
        const cityCollection: ICity[] = [sampleWithPartialData];
        expectedResult = service.addCityToCollectionIfMissing(cityCollection, city);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(city);
      });

      it('should add only unique City to an array', () => {
        const cityArray: ICity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cityCollection: ICity[] = [sampleWithRequiredData];
        expectedResult = service.addCityToCollectionIfMissing(cityCollection, ...cityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const city: ICity = sampleWithRequiredData;
        const city2: ICity = sampleWithPartialData;
        expectedResult = service.addCityToCollectionIfMissing([], city, city2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(city);
        expect(expectedResult).toContain(city2);
      });

      it('should accept null and undefined values', () => {
        const city: ICity = sampleWithRequiredData;
        expectedResult = service.addCityToCollectionIfMissing([], null, city, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(city);
      });

      it('should return initial array if no City is added', () => {
        const cityCollection: ICity[] = [sampleWithRequiredData];
        expectedResult = service.addCityToCollectionIfMissing(cityCollection, undefined, null);
        expect(expectedResult).toEqual(cityCollection);
      });
    });

    describe('compareCity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCity(entity1, entity2);
        const compareResult2 = service.compareCity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCity(entity1, entity2);
        const compareResult2 = service.compareCity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCity(entity1, entity2);
        const compareResult2 = service.compareCity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
