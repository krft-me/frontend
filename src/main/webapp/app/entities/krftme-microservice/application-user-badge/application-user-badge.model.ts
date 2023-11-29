import dayjs from 'dayjs/esm';
import { IApplicationUser } from 'app/entities/krftme-microservice/application-user/application-user.model';
import { IBadge } from 'app/entities/krftme-microservice/badge/badge.model';

export interface IApplicationUserBadge {
  id: number;
  obtainedDate?: dayjs.Dayjs | null;
  user?: Pick<IApplicationUser, 'id'> | null;
  badge?: Pick<IBadge, 'id'> | null;
}

export type NewApplicationUserBadge = Omit<IApplicationUserBadge, 'id'> & { id: null };
