import { IMachine } from 'app/entities/machine/machine.model';

export interface ICategory {
  id: number;
  label?: string | null;
  machine?: Pick<IMachine, 'id'> | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
