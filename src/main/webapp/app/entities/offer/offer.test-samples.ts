import { IOffer, NewOffer } from './offer.model';

export const sampleWithRequiredData: IOffer = {
  id: 85569,
  name: 'Gorgeous Analyste Franche-Comté',
};

export const sampleWithPartialData: IOffer = {
  id: 38015,
  name: 'b',
};

export const sampleWithFullData: IOffer = {
  id: 81648,
  name: 'exploit Nord-Pas-de-Calais lime',
};

export const sampleWithNewData: NewOffer = {
  name: 'driver directional',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
