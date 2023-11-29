import { IApplicationUser, NewApplicationUser } from "./application-user.model";

export const sampleWithRequiredData: IApplicationUser = {
  id: 60827,
  firstName: "Aurore",
  lastName: "Breton",
  username: "connecting withdrawal mobile"
};

export const sampleWithPartialData: IApplicationUser = {
  id: 34398,
  firstName: "Jacques"',
  lastName: "Prevost"',
  username: "Electronics transmit"
};

export const sampleWithFullData: IApplicationUser = {
  id: 69539,
  firstName: "Mélissandre",
  lastName: "Vasseur",
  username: "eyeballs Optimized",
  profilePictureId: "2ffceb61-c582-4a2e-aff5-0fd2cb096a72"
};

export const sampleWithNewData: NewApplicationUser = {
  firstName: "Lorrain",
  lastName: "Gauthier",
  username: "orchestrate object-oriented models",
  id: null
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
