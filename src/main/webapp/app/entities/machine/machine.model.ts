import { ICategory } from 'app/entities/category/category.model';

export interface IMachine {
  id: number;
  name?: string | null;
  category?: Pick<ICategory, 'id'> | null;
}

export type NewMachine = Omit<IMachine, 'id'> & { id: null };
