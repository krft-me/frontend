import { IMachineCategory, NewMachineCategory } from './machine-category.model';

export const sampleWithRequiredData: IMachineCategory = {
  id: 4518,
  label: 'transmitting',
};

export const sampleWithPartialData: IMachineCategory = {
  id: 68928,
  label: 'Unbranded robust c',
};

export const sampleWithFullData: IMachineCategory = {
  id: 9950,
  label: 'salmon Bourgogne Keyboard',
};

export const sampleWithNewData: NewMachineCategory = {
  label: 'Agent a',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
