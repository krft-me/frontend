import dayjs from "dayjs/esm";

import { State } from "app/entities/enumerations/state.model";

import { IOrder, NewOrder } from "./order.model";

export const sampleWithRequiredData: IOrder = {
  id: 47761,
  date: dayjs("2023-11-29T10:57"),
  state: State["CANCELLED"]
};

export const sampleWithPartialData: IOrder = {
  id: 52696,
  date: dayjs("2023-11-29T02:39"),
  state: State.SIGNED,
};

export const sampleWithFullData: IOrder = {
  id: 47091,
  date: dayjs("2023-11-29T05:39"),
  state: State["DONE"]
};

export const sampleWithNewData: NewOrder = {
  date: dayjs("2023-11-29T16:37"),
  state: State["CANCELLED"],
  id: null
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
