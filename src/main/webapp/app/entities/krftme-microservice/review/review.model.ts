import { IOrder } from 'app/entities/krftme-microservice/order/order.model';

export interface IReview {
  id: number;
  rating?: number | null;
  comment?: string | null;
  order?: Pick<IOrder, 'id'> | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
