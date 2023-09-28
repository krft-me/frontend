import { ICity } from 'app/entities/city/city.model';

export interface IApplicationUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  pseudo?: string | null;
  averageRating?: number | null;
  city?: Pick<ICity, 'id'> | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
