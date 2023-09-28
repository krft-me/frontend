import { IBadge, NewBadge } from './badge.model';

export const sampleWithRequiredData: IBadge = {
  id: 22734,
  label: 'Refined gold Mouse',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithPartialData: IBadge = {
  id: 30114,
  label: 'Keyboard Fresh',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithFullData: IBadge = {
  id: 86797,
  label: 'Tasty platforms',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithNewData: NewBadge = {
  label: 'customized Stagiaire Loan',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
