import { IMachineCategory } from 'app/entities/krftme-microservice/machine-category/machine-category.model';

export interface IMachine {
  id: number;
  name?: string | null;
  category?: Pick<IMachineCategory, 'id'> | null;
}

export type NewMachine = Omit<IMachine, 'id'> & { id: null };
