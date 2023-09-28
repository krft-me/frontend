export interface IOffer {
  id: number;
  name?: string | null;
}

export type NewOffer = Omit<IOffer, 'id'> & { id: null };
