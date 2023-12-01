import { IRegion } from 'app/entities/krftme-microservice/region/region.model';

export interface ICity {
  id: number;
  name?: string | null;
  zipCode?: string | null;
  region?: Pick<IRegion, 'id'> | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null };
