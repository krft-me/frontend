import { IRegion } from 'app/entities/region/region.model';

export interface ICity {
  id: number;
  name?: string | null;
  region?: Pick<IRegion, 'id'> | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null };
