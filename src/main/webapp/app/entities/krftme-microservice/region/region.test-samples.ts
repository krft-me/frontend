import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: 27363,
  name: 'back-end Practical',
};

export const sampleWithPartialData: IRegion = {
  id: 64889,
  name: 'Victoire',
};

export const sampleWithFullData: IRegion = {
  id: 75657,
  name: 'parse',
};

export const sampleWithNewData: NewRegion = {
  name: 'Berkshire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
