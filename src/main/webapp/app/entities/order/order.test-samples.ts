import dayjs from 'dayjs/esm';

import { State } from 'app/entities/enumerations/state.model';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
  date: dayjs('2023-10-02T04:31'),
  state: State['CANCELLED'],
};

export const sampleWithPartialData: IOrder = {
  id: 52696,
  date: dayjs('2023-10-01T20:13'),
  state: State['SIGNED'],
};

export const sampleWithFullData: IOrder = {
  id: 47091,
  date: dayjs('2023-10-01T23:13'),
  state: State['DONE'],
};

export const sampleWithNewData: NewOrder = {
  date: dayjs('2023-10-02T10:11'),
  state: State['CANCELLED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
