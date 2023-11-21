export interface ICategory {
  id: number;
  label?: string | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
