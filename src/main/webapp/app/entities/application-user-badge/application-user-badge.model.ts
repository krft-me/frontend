import dayjs from 'dayjs/esm';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { IBadge } from 'app/entities/badge/badge.model';

export interface IApplicationUserBadge {
  id: number;
  obtentionDate?: dayjs.Dayjs | null;
  applicationUser?: Pick<IApplicationUser, 'id'> | null;
  badge?: Pick<IBadge, 'id'> | null;
}

export type NewApplicationUserBadge = Omit<IApplicationUserBadge, 'id'> & { id: null };
