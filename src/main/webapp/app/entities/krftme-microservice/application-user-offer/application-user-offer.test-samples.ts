import { IApplicationUserOffer, NewApplicationUserOffer } from "./application-user-offer.model";

export const sampleWithRequiredData: IApplicationUserOffer = {
  id: 57587,
  description: "Mali Avon a",
  price: 58807,
  active: false
};

export const sampleWithPartialData: IApplicationUserOffer = {
  id: 14277,
  description: "Soap Coordinateur Synergized"',
  price: 23412,
  active: tru
};

export const sampleWithFullData: IApplicationUserOffer = {
  id: 78559,
  description: "digital Sports Berkshire",
  price: 15850,
  active: false
};

export const sampleWithNewData: NewApplicationUserOffer = {
  description: "grey",
  price: 7399,
  active: true,
  id: null
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
