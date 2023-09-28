import dayjs from 'dayjs/esm';

import { IApplicationUserBadge, NewApplicationUserBadge } from './application-user-badge.model';

export const sampleWithRequiredData: IApplicationUserBadge = {
  id: 52766,
  obtentionDate: dayjs('2023-09-27T18:34'),
};

export const sampleWithPartialData: IApplicationUserBadge = {
  id: 490,
  obtentionDate: dayjs('2023-09-28T02:36'),
};

export const sampleWithFullData: IApplicationUserBadge = {
  id: 6776,
  obtentionDate: dayjs('2023-09-28T09:05'),
};

export const sampleWithNewData: NewApplicationUserBadge = {
  obtentionDate: dayjs('2023-09-28T11:19'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
