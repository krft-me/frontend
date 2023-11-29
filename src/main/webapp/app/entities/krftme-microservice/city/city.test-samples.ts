import { ICity, NewCity } from "./city.model";

export const sampleWithRequiredData: ICity = {
  id: 79135,
  name: "up multi-byte",
  zipCode: "00758"
};

export const sampleWithPartialData: ICity = {
  id: 62664,
  name: "EXE"',
  zipCode: "50993"
};

export const sampleWithFullData: ICity = {
  id: 50125,
  name: "challenge de b"',
  zipCode: "43152"
};

export const sampleWithNewData: NewCity = {
  name: "Towels deposit Handcrafted"',
  zipCode: "09728"',
  id: nul
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
