import { IOffer } from 'app/entities/offer/offer.model';

export interface IMachine {
  id: number;
  name?: string | null;
  offer?: Pick<IOffer, 'id'> | null;
}

export type NewMachine = Omit<IMachine, 'id'> & { id: null };
