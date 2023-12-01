import { IShowcase, NewShowcase } from './showcase.model';

export const sampleWithRequiredData: IShowcase = {
  id: 54885,
  imageId: '0a36b761-a51f-42e5-ac16-8a09bbfb5bad',
};

export const sampleWithPartialData: IShowcase = {
  id: 29618,
  imageId: '6e135bd0-de0a-4812-9b6b-98e0d2c510f2',
};

export const sampleWithFullData: IShowcase = {
  id: 13453,
  imageId: '8f42a38f-8e36-43e1-8cc0-688f15fd8531',
};

export const sampleWithNewData: NewShowcase = {
  imageId: '1aedddaf-eeda-4e7b-be65-5340dc280be2',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
