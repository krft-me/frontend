export interface IMachineCategory {
  id: number;
  label?: string | null;
}

export type NewMachineCategory = Omit<IMachineCategory, 'id'> & { id: null };
