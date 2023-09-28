import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';

export interface ITag {
  id: number;
  label?: string | null;
  applicationUserOffer?: Pick<IApplicationUserOffer, 'id'> | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
