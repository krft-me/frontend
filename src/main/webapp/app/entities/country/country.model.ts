export interface ICountry {
  id: number;
  name?: string | null;
}

export type NewCountry = Omit<ICountry, 'id'> & { id: null };
