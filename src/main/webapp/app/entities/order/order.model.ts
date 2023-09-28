import dayjs from 'dayjs/esm';
import { IApplicationUserOffer } from 'app/entities/application-user-offer/application-user-offer.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { State } from 'app/entities/enumerations/state.model';

export interface IOrder {
  id: number;
  date?: dayjs.Dayjs | null;
  state?: State | null;
  provider?: Pick<IApplicationUserOffer, 'id'> | null;
  client?: Pick<IApplicationUser, 'id'> | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
