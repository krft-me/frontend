import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IOfferPackage {
  id: number;
  title: string;
  price: number;
  description: string;
  rating: number;
  nbRatings: number;
}

export type NewOfferPackage = Omit<IOfferPackage, 'id'> & { id: null };
