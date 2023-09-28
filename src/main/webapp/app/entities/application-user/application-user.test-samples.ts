import { IApplicationUser, NewApplicationUser } from './application-user.model';

export const sampleWithRequiredData: IApplicationUser = {
  id: 60827,
  firstName: 'Aurore',
  lastName: 'Breton',
  pseudo: 'connecting withdrawal mobile',
  averageRating: 13351,
};

export const sampleWithPartialData: IApplicationUser = {
  id: 34398,
  firstName: 'Jacques',
  lastName: 'Prevost',
  pseudo: 'Electronics transmit',
  averageRating: 69539,
};

export const sampleWithFullData: IApplicationUser = {
  id: 36652,
  firstName: 'Manassé',
  lastName: 'Colin',
  pseudo: 'orchid Ukraine',
  averageRating: 98576,
};

export const sampleWithNewData: NewApplicationUser = {
  firstName: 'Théophile',
  lastName: 'Gonzalez',
  pseudo: 'interface cross-platform Tuna',
  averageRating: 92611,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
