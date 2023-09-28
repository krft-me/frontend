import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: 4746,
  name: 'SCSI c deposit',
};

export const sampleWithPartialData: ICountry = {
  id: 24965,
  name: 'payment',
};

export const sampleWithFullData: ICountry = {
  id: 42559,
  name: '1080p Concrete',
};

export const sampleWithNewData: NewCountry = {
  name: 'du',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
