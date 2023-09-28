import { IOffer } from 'app/entities/offer/offer.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IApplicationUserOffer {
  id: number;
  description?: string | null;
  offer?: Pick<IOffer, 'id'> | null;
  applicationUser?: Pick<IApplicationUser, 'id'> | null;
}

export type NewApplicationUserOffer = Omit<IApplicationUserOffer, 'id'> & { id: null };
