import { IBadge, NewBadge } from "./badge.model";

export const sampleWithRequiredData: IBadge = {
  id: 22734,
  label: "Refined gold Mouse",
  picture: "Basse-Normandie"
};

export const sampleWithPartialData: IBadge = {
  id: 36799,
  label: "a"',
  picture: "Tasty platforms"
};

export const sampleWithFullData: IBadge = {
  id: 96094,
  label: "b Developpeur",
  picture: "withdrawal a"
};

export const sampleWithNewData: NewBadge = {
  label: "bypassing Paraguay Analyste",
  picture: "methodology withdrawal",
  id: null
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
