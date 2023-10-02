import dayjs from 'dayjs/esm';

import { IApplicationUserBadge, NewApplicationUserBadge } from './application-user-badge.model';

export const sampleWithRequiredData: IApplicationUserBadge = {
  id: 52766,
  obtentionDate: dayjs('2023-10-01T14:20'),
};

export const sampleWithPartialData: IApplicationUserBadge = {
  id: 490,
  obtentionDate: dayjs('2023-10-01T22:21'),
};

export const sampleWithFullData: IApplicationUserBadge = {
  id: 6776,
  obtentionDate: dayjs('2023-10-02T04:50'),
};

export const sampleWithNewData: NewApplicationUserBadge = {
  obtentionDate: dayjs('2023-10-02T07:04'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
