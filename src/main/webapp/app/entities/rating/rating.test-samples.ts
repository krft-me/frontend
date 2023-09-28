import { IRating, NewRating } from './rating.model';

export const sampleWithRequiredData: IRating = {
  id: 92458,
  rate: 88012,
};

export const sampleWithPartialData: IRating = {
  id: 62920,
  rate: 48944,
};

export const sampleWithFullData: IRating = {
  id: 33071,
  rate: 32763,
  comment: 'Lituanie a white',
};

export const sampleWithNewData: NewRating = {
  rate: 55462,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
