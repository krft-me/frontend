export interface IBadge {
  id: number;
  label?: string | null;
  picture?: string | null;
  pictureContentType?: string | null;
}

export type NewBadge = Omit<IBadge, 'id'> & { id: null };
