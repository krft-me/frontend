import { IUser } from 'app/entities/user/user.model';
import { ICity } from 'app/entities/krftme-microservice/city/city.model';

export interface IApplicationUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  profilePictureId?: string | null;
  internalUser?: Pick<IUser, 'id'> | null;
  city?: Pick<ICity, 'id'> | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
