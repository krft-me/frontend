import { ICountry } from 'app/entities/krftme-microservice/country/country.model';

export interface IRegion {
  id: number;
  name?: string | null;
  country?: Pick<ICountry, 'id'> | null;
}

export type NewRegion = Omit<IRegion, 'id'> & { id: null };
