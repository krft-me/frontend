import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';

export interface IRating {
  id: number;
  rate?: number | null;
  comment?: string | null;
  applicationUserOffer?: Pick<IApplicationUserOffer, 'id'> | null;
}

export type NewRating = Omit<IRating, 'id'> & { id: null };
