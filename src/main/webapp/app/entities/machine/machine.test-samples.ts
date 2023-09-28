import { IMachine, NewMachine } from './machine.model';

export const sampleWithRequiredData: IMachine = {
  id: 87927,
  name: 'a SCSI',
};

export const sampleWithPartialData: IMachine = {
  id: 16205,
  name: 'panel',
};

export const sampleWithFullData: IMachine = {
  id: 37586,
  name: 'relationships invoice Concrete',
};

export const sampleWithNewData: NewMachine = {
  name: 'navigating',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
