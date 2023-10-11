import { IUser } from 'app/entities/user/user.model';
import { ICity } from 'app/entities/city/city.model';
import { IOffer } from 'app/entities/offer/offer.model';

export interface IApplicationUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  pseudo?: string | null;
  averageRating?: number | null;
  internalUser?: Pick<IUser, 'id'> | null;
  city?: Pick<ICity, 'id'> | null;
  favoriteApplicationUsers?: Pick<IApplicationUser, 'id'>[] | null;
  favoriteOffers?: Pick<IOffer, 'id'>[] | null;
  followers?: Pick<IApplicationUser, 'id'>[] | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
