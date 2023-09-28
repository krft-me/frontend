import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';

export interface IShowcase {
  id: number;
  imageId?: string | null;
  applicationUserOffer?: Pick<IApplicationUserOffer, 'id'> | null;
}

export type NewShowcase = Omit<IShowcase, 'id'> & { id: null };
