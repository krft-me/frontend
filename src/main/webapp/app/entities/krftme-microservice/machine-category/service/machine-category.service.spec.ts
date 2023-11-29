import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMachineCategory } from '../machine-category.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../machine-category.test-samples';

import { MachineCategoryService } from './machine-category.service';

const requireRestSample: IMachineCategory = {
  ...sampleWithRequiredData,
};

describe('MachineCategory Service', () => {
  let service: MachineCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IMachineCategory | IMachineCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MachineCategoryService);
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

    it('should create a MachineCategory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const machineCategory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(machineCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MachineCategory', () => {
      const machineCategory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(machineCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MachineCategory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MachineCategory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MachineCategory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMachineCategoryToCollectionIfMissing', () => {
      it('should add a MachineCategory to an empty array', () => {
        const machineCategory: IMachineCategory = sampleWithRequiredData;
        expectedResult = service.addMachineCategoryToCollectionIfMissing([], machineCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(machineCategory);
      });

      it('should not add a MachineCategory to an array that contains it', () => {
        const machineCategory: IMachineCategory = sampleWithRequiredData;
        const machineCategoryCollection: IMachineCategory[] = [
          {
            ...machineCategory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMachineCategoryToCollectionIfMissing(machineCategoryCollection, machineCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MachineCategory to an array that doesn't contain it", () => {
        const machineCategory: IMachineCategory = sampleWithRequiredData;
        const machineCategoryCollection: IMachineCategory[] = [sampleWithPartialData];
        expectedResult = service.addMachineCategoryToCollectionIfMissing(machineCategoryCollection, machineCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(machineCategory);
      });

      it('should add only unique MachineCategory to an array', () => {
        const machineCategoryArray: IMachineCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const machineCategoryCollection: IMachineCategory[] = [sampleWithRequiredData];
        expectedResult = service.addMachineCategoryToCollectionIfMissing(machineCategoryCollection, ...machineCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const machineCategory: IMachineCategory = sampleWithRequiredData;
        const machineCategory2: IMachineCategory = sampleWithPartialData;
        expectedResult = service.addMachineCategoryToCollectionIfMissing([], machineCategory, machineCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(machineCategory);
        expect(expectedResult).toContain(machineCategory2);
      });

      it('should accept null and undefined values', () => {
        const machineCategory: IMachineCategory = sampleWithRequiredData;
        expectedResult = service.addMachineCategoryToCollectionIfMissing([], null, machineCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(machineCategory);
      });

      it('should return initial array if no MachineCategory is added', () => {
        const machineCategoryCollection: IMachineCategory[] = [sampleWithRequiredData];
        expectedResult = service.addMachineCategoryToCollectionIfMissing(machineCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(machineCategoryCollection);
      });
    });

    describe('compareMachineCategory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMachineCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMachineCategory(entity1, entity2);
        const compareResult2 = service.compareMachineCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMachineCategory(entity1, entity2);
        const compareResult2 = service.compareMachineCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMachineCategory(entity1, entity2);
        const compareResult2 = service.compareMachineCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
