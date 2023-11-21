import { IMachine } from 'app/entities/machine/machine.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IOffer {
  id: number;
  name?: string | null;
  machine?: Pick<IMachine, 'id'> | null;
  followers?: Pick<IApplicationUser, 'id'>[] | null;
}

export type NewOffer = Omit<IOffer, 'id'> & { id: null };
