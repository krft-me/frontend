import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 2529,
  label: 'Namibia Sausages',
};

export const sampleWithPartialData: ICategory = {
  id: 77300,
  label: 'Tala',
};

export const sampleWithFullData: ICategory = {
  id: 35403,
  label: 'gold',
};

export const sampleWithNewData: NewCategory = {
  label: 'PCI virtual Chair',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
