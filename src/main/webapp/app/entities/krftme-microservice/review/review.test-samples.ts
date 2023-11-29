import { IReview, NewReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: 33078,
  rating: 27,
};

export const sampleWithPartialData: IReview = {
  id: 93908,
  rating: 41,
  comment: 'mesh transmitting state',
};

export const sampleWithFullData: IReview = {
  id: 10183,
  rating: 10,
  comment: 'panel',
};

export const sampleWithNewData: NewReview = {
  rating: 34,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
