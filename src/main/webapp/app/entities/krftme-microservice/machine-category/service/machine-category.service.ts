import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMachineCategory, NewMachineCategory } from '../machine-category.model';

export type PartialUpdateMachineCategory = Partial<IMachineCategory> & Pick<IMachineCategory, 'id'>;

export type EntityResponseType = HttpResponse<IMachineCategory>;
export type EntityArrayResponseType = HttpResponse<IMachineCategory[]>;

@Injectable({ providedIn: 'root' })
export class MachineCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/machine-categories', 'krftme-microservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(machineCategory: NewMachineCategory): Observable<EntityResponseType> {
    return this.http.post<IMachineCategory>(this.resourceUrl, machineCategory, { observe: 'response' });
  }

  update(machineCategory: IMachineCategory): Observable<EntityResponseType> {
    return this.http.put<IMachineCategory>(`${this.resourceUrl}/${this.getMachineCategoryIdentifier(machineCategory)}`, machineCategory, {
      observe: 'response',
    });
  }

  partialUpdate(machineCategory: PartialUpdateMachineCategory): Observable<EntityResponseType> {
    return this.http.patch<IMachineCategory>(`${this.resourceUrl}/${this.getMachineCategoryIdentifier(machineCategory)}`, machineCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMachineCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMachineCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMachineCategoryIdentifier(machineCategory: Pick<IMachineCategory, 'id'>): number {
    return machineCategory.id;
  }

  compareMachineCategory(o1: Pick<IMachineCategory, 'id'> | null, o2: Pick<IMachineCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getMachineCategoryIdentifier(o1) === this.getMachineCategoryIdentifier(o2) : o1 === o2;
  }

  addMachineCategoryToCollectionIfMissing<Type extends Pick<IMachineCategory, 'id'>>(
    machineCategoryCollection: Type[],
    ...machineCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const machineCategories: Type[] = machineCategoriesToCheck.filter(isPresent);
    if (machineCategories.length > 0) {
      const machineCategoryCollectionIdentifiers = machineCategoryCollection.map(
        machineCategoryItem => this.getMachineCategoryIdentifier(machineCategoryItem)!
      );
      const machineCategoriesToAdd = machineCategories.filter(machineCategoryItem => {
        const machineCategoryIdentifier = this.getMachineCategoryIdentifier(machineCategoryItem);
        if (machineCategoryCollectionIdentifiers.includes(machineCategoryIdentifier)) {
          return false;
        }
        machineCategoryCollectionIdentifiers.push(machineCategoryIdentifier);
        return true;
      });
      return [...machineCategoriesToAdd, ...machineCategoryCollection];
    }
    return machineCategoryCollection;
  }
}
