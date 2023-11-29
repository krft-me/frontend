import { IApplicationUserOffer } from 'app/entities/krftme-microservice/application-user-offer/application-user-offer.model';

export interface ITag {
  id: number;
  label?: string | null;
  offers?: Pick<IApplicationUserOffer, 'id'>[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
