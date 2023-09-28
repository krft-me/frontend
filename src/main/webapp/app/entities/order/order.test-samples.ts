import dayjs from 'dayjs/esm';

import { State } from 'app/entities/enumerations/state.model';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
  date: dayjs('2023-09-28T08:46'),
  state: State['CANCELLED'],
};

export const sampleWithPartialData: IOrder = {
  id: 52696,
  date: dayjs('2023-09-28T00:28'),
  state: State['SIGNED'],
};

export const sampleWithFullData: IOrder = {
  id: 47091,
  date: dayjs('2023-09-28T03:28'),
  state: State['DONE'],
};

export const sampleWithNewData: NewOrder = {
  date: dayjs('2023-09-28T14:26'),
  state: State['CANCELLED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
