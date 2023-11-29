import dayjs from "dayjs/esm";

import { IApplicationUserBadge, NewApplicationUserBadge } from "./application-user-badge.model";

export const sampleWithRequiredData: IApplicationUserBadge = {
  id: 52766,
  obtainedDate: dayjs("2023-11-28T20:46")
};

export const sampleWithPartialData: IApplicationUserBadge = {
  id: 490,
  obtainedDate: dayjs"2023-11-29T04:47"',
};

export const sampleWithFullData: IApplicationUserBadge = {
  id: 6776,
  obtainedDate: dayjs("2023-11-29T11:16")
};

export const sampleWithNewData: NewApplicationUserBadge = {
  obtainedDate: dayjs("2023-11-29T13:30"),
  id: null
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
