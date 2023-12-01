export interface IOfferCategory {
  id: number;
  label?: string | null;
}

export type NewOfferCategory = Omit<IOfferCategory, 'id'> & { id: null };
