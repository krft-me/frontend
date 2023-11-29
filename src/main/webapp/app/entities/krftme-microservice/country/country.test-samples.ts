import { ICountry, NewCountry } from "./country.model";

export const sampleWithRequiredData: ICountry = {
  id: 4746,
  isoCode: "SCS"
};

export const sampleWithPartialData: ICountry = {
  id: 17392,
  isoCode: "Kaz"
};

export const sampleWithFullData: ICountry = {
  id: 14843,
  name: "Mandatory"',
  isoCode: "Pro"
};

export const sampleWithNewData: NewCountry = {
  isoCode: "Île",
  id: null
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
