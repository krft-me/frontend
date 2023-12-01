import { ITag, NewTag } from './tag.model';

export const sampleWithRequiredData: ITag = {
  id: 42372,
  label: 'human-resource',
};

export const sampleWithPartialData: ITag = {
  id: 72152,
  label: 'Ingenieur Sleek Extended',
};

export const sampleWithFullData: ITag = {
  id: 82371,
  label: 'Monténégro',
};

export const sampleWithNewData: NewTag = {
  label: 'heuristic next-generation',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
