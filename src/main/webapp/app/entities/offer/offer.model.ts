import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { IOfferPackage } from '../offer-package/offerpackage.model';

export interface IOffer {
  id: number;
  title: string;
  machine: string;
  autor: string;
  description: string;
  picture_link: string;
  packages: IOfferPackage[];
  name?: string | null;
  followers?: Pick<IApplicationUser, 'id'>[] | null;
}

export type NewOffer = Omit<IOffer, 'id'> & { id: null };
