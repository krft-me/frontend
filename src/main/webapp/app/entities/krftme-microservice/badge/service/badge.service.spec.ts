import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBadge } from '../badge.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../badge.test-samples';

import { BadgeService } from './badge.service';

const requireRestSample: IBadge = {
  ...sampleWithRequiredData,
};

describe('Badge Service', () => {
  let service: BadgeService;
  let httpMock: HttpTestingController;
  let expectedResult: IBadge | IBadge[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BadgeService);
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

    it('should create a Badge', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const badge = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(badge).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Badge', () => {
      const badge = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(badge).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Badge', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Badge', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Badge', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBadgeToCollectionIfMissing', () => {
      it('should add a Badge to an empty array', () => {
        const badge: IBadge = sampleWithRequiredData;
        expectedResult = service.addBadgeToCollectionIfMissing([], badge);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(badge);
      });

      it('should not add a Badge to an array that contains it', () => {
        const badge: IBadge = sampleWithRequiredData;
        const badgeCollection: IBadge[] = [
          {
            ...badge,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBadgeToCollectionIfMissing(badgeCollection, badge);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Badge to an array that doesn't contain it", () => {
        const badge: IBadge = sampleWithRequiredData;
        const badgeCollection: IBadge[] = [sampleWithPartialData];
        expectedResult = service.addBadgeToCollectionIfMissing(badgeCollection, badge);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(badge);
      });

      it('should add only unique Badge to an array', () => {
        const badgeArray: IBadge[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const badgeCollection: IBadge[] = [sampleWithRequiredData];
        expectedResult = service.addBadgeToCollectionIfMissing(badgeCollection, ...badgeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const badge: IBadge = sampleWithRequiredData;
        const badge2: IBadge = sampleWithPartialData;
        expectedResult = service.addBadgeToCollectionIfMissing([], badge, badge2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(badge);
        expect(expectedResult).toContain(badge2);
      });

      it('should accept null and undefined values', () => {
        const badge: IBadge = sampleWithRequiredData;
        expectedResult = service.addBadgeToCollectionIfMissing([], null, badge, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(badge);
      });

      it('should return initial array if no Badge is added', () => {
        const badgeCollection: IBadge[] = [sampleWithRequiredData];
        expectedResult = service.addBadgeToCollectionIfMissing(badgeCollection, undefined, null);
        expect(expectedResult).toEqual(badgeCollection);
      });
    });

    describe('compareBadge', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBadge(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBadge(entity1, entity2);
        const compareResult2 = service.compareBadge(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBadge(entity1, entity2);
        const compareResult2 = service.compareBadge(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBadge(entity1, entity2);
        const compareResult2 = service.compareBadge(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
