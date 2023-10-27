import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IOffer {
  id: number;
  name?: string | null;
  followers?: Pick<IApplicationUser, 'id'>[] | null;
}

export type NewOffer = Omit<IOffer, 'id'> & { id: null };
