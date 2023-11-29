import { IMachine } from 'app/entities/krftme-microservice/machine/machine.model';
import { IOfferCategory } from 'app/entities/krftme-microservice/offer-category/offer-category.model';

export interface IOffer {
  id: number;
  name?: string | null;
  machine?: Pick<IMachine, 'id'> | null;
  category?: Pick<IOfferCategory, 'id'> | null;
}

export type NewOffer = Omit<IOffer, 'id'> & { id: null };
