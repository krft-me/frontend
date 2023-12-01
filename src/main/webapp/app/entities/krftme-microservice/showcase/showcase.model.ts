import { IApplicationUserOffer } from 'app/entities/krftme-microservice/application-user-offer/application-user-offer.model';

export interface IShowcase {
  id: number;
  imageId?: string | null;
  offer?: Pick<IApplicationUserOffer, 'id'> | null;
}

export type NewShowcase = Omit<IShowcase, 'id'> & { id: null };
