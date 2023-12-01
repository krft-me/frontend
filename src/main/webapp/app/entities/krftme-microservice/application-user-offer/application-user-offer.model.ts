import { ITag } from 'app/entities/krftme-microservice/tag/tag.model';
import { IApplicationUser } from 'app/entities/krftme-microservice/application-user/application-user.model';
import { IOffer } from 'app/entities/krftme-microservice/offer/offer.model';

export interface IApplicationUserOffer {
  id: number;
  description?: string | null;
  price?: number | null;
  active?: boolean | null;
  tags?: Pick<ITag, 'id'>[] | null;
  provider?: Pick<IApplicationUser, 'id'> | null;
  offer?: Pick<IOffer, 'id'> | null;
}

export type NewApplicationUserOffer = Omit<IApplicationUserOffer, 'id'> & { id: null };
