import { IApplicationUserOffer, NewApplicationUserOffer } from './application-user-offer.model';

export const sampleWithRequiredData: IApplicationUserOffer = {
  id: 57587,
  description: 'Mali Avon a',
};

export const sampleWithPartialData: IApplicationUserOffer = {
  id: 58807,
  description: 'Frozen',
};

export const sampleWithFullData: IApplicationUserOffer = {
  id: 60635,
  description: 'Coordinateur',
};

export const sampleWithNewData: NewApplicationUserOffer = {
  description: 'SMTP',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
