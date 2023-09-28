import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICity, NewCity } from '../city.model';

export type PartialUpdateCity = Partial<ICity> & Pick<ICity, 'id'>;

export type EntityResponseType = HttpResponse<ICity>;
export type EntityArrayResponseType = HttpResponse<ICity[]>;

@Injectable({ providedIn: 'root' })
export class CityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(city: NewCity): Observable<EntityResponseType> {
    return this.http.post<ICity>(this.resourceUrl, city, { observe: 'response' });
  }

  update(city: ICity): Observable<EntityResponseType> {
    return this.http.put<ICity>(`${this.resourceUrl}/${this.getCityIdentifier(city)}`, city, { observe: 'response' });
  }

  partialUpdate(city: PartialUpdateCity): Observable<EntityResponseType> {
    return this.http.patch<ICity>(`${this.resourceUrl}/${this.getCityIdentifier(city)}`, city, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCityIdentifier(city: Pick<ICity, 'id'>): number {
    return city.id;
  }

  compareCity(o1: Pick<ICity, 'id'> | null, o2: Pick<ICity, 'id'> | null): boolean {
    return o1 && o2 ? this.getCityIdentifier(o1) === this.getCityIdentifier(o2) : o1 === o2;
  }

  addCityToCollectionIfMissing<Type extends Pick<ICity, 'id'>>(
    cityCollection: Type[],
    ...citiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cities: Type[] = citiesToCheck.filter(isPresent);
    if (cities.length > 0) {
      const cityCollectionIdentifiers = cityCollection.map(cityItem => this.getCityIdentifier(cityItem)!);
      const citiesToAdd = cities.filter(cityItem => {
        const cityIdentifier = this.getCityIdentifier(cityItem);
        if (cityCollectionIdentifiers.includes(cityIdentifier)) {
          return false;
        }
        cityCollectionIdentifiers.push(cityIdentifier);
        return true;
      });
      return [...citiesToAdd, ...cityCollection];
    }
    return cityCollection;
  }
}
