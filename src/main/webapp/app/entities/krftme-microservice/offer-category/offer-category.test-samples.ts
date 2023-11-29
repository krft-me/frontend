import { IOfferCategory, NewOfferCategory } from './offer-category.model';

export const sampleWithRequiredData: IOfferCategory = {
  id: 47581,
  label: 'array',
};

export const sampleWithPartialData: IOfferCategory = {
  id: 92843,
  label: 'Poitou-Charentes transmitting',
};

export const sampleWithFullData: IOfferCategory = {
  id: 80178,
  label: 'c Managed',
};

export const sampleWithNewData: NewOfferCategory = {
  label: 'Networked Home',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
