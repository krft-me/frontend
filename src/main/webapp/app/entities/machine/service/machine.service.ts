import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMachine, NewMachine } from '../machine.model';

export type PartialUpdateMachine = Partial<IMachine> & Pick<IMachine, 'id'>;

export type EntityResponseType = HttpResponse<IMachine>;
export type EntityArrayResponseType = HttpResponse<IMachine[]>;

@Injectable({ providedIn: 'root' })
export class MachineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/machines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(machine: NewMachine): Observable<EntityResponseType> {
    return this.http.post<IMachine>(this.resourceUrl, machine, { observe: 'response' });
  }

  update(machine: IMachine): Observable<EntityResponseType> {
    return this.http.put<IMachine>(`${this.resourceUrl}/${this.getMachineIdentifier(machine)}`, machine, { observe: 'response' });
  }

  partialUpdate(machine: PartialUpdateMachine): Observable<EntityResponseType> {
    return this.http.patch<IMachine>(`${this.resourceUrl}/${this.getMachineIdentifier(machine)}`, machine, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMachine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMachine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMachineIdentifier(machine: Pick<IMachine, 'id'>): number {
    return machine.id;
  }

  compareMachine(o1: Pick<IMachine, 'id'> | null, o2: Pick<IMachine, 'id'> | null): boolean {
    return o1 && o2 ? this.getMachineIdentifier(o1) === this.getMachineIdentifier(o2) : o1 === o2;
  }

  addMachineToCollectionIfMissing<Type extends Pick<IMachine, 'id'>>(
    machineCollection: Type[],
    ...machinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const machines: Type[] = machinesToCheck.filter(isPresent);
    if (machines.length > 0) {
      const machineCollectionIdentifiers = machineCollection.map(machineItem => this.getMachineIdentifier(machineItem)!);
      const machinesToAdd = machines.filter(machineItem => {
        const machineIdentifier = this.getMachineIdentifier(machineItem);
        if (machineCollectionIdentifiers.includes(machineIdentifier)) {
          return false;
        }
        machineCollectionIdentifiers.push(machineIdentifier);
        return true;
      });
      return [...machinesToAdd, ...machineCollection];
    }
    return machineCollection;
  }
}
