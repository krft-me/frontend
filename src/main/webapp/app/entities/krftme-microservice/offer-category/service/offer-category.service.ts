import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOfferCategory, NewOfferCategory } from '../offer-category.model';

export type PartialUpdateOfferCategory = Partial<IOfferCategory> & Pick<IOfferCategory, 'id'>;

export type EntityResponseType = HttpResponse<IOfferCategory>;
export type EntityArrayResponseType = HttpResponse<IOfferCategory[]>;

@Injectable({ providedIn: 'root' })
export class OfferCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offer-categories', 'krftme-microservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offerCategory: NewOfferCategory): Observable<EntityResponseType> {
    return this.http.post<IOfferCategory>(this.resourceUrl, offerCategory, { observe: 'response' });
  }

  update(offerCategory: IOfferCategory): Observable<EntityResponseType> {
    return this.http.put<IOfferCategory>(`${this.resourceUrl}/${this.getOfferCategoryIdentifier(offerCategory)}`, offerCategory, {
      observe: 'response',
    });
  }

  partialUpdate(offerCategory: PartialUpdateOfferCategory): Observable<EntityResponseType> {
    return this.http.patch<IOfferCategory>(`${this.resourceUrl}/${this.getOfferCategoryIdentifier(offerCategory)}`, offerCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOfferCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOfferCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOfferCategoryIdentifier(offerCategory: Pick<IOfferCategory, 'id'>): number {
    return offerCategory.id;
  }

  compareOfferCategory(o1: Pick<IOfferCategory, 'id'> | null, o2: Pick<IOfferCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getOfferCategoryIdentifier(o1) === this.getOfferCategoryIdentifier(o2) : o1 === o2;
  }

  addOfferCategoryToCollectionIfMissing<Type extends Pick<IOfferCategory, 'id'>>(
    offerCategoryCollection: Type[],
    ...offerCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offerCategories: Type[] = offerCategoriesToCheck.filter(isPresent);
    if (offerCategories.length > 0) {
      const offerCategoryCollectionIdentifiers = offerCategoryCollection.map(
        offerCategoryItem => this.getOfferCategoryIdentifier(offerCategoryItem)!
      );
      const offerCategoriesToAdd = offerCategories.filter(offerCategoryItem => {
        const offerCategoryIdentifier = this.getOfferCategoryIdentifier(offerCategoryItem);
        if (offerCategoryCollectionIdentifiers.includes(offerCategoryIdentifier)) {
          return false;
        }
        offerCategoryCollectionIdentifiers.push(offerCategoryIdentifier);
        return true;
      });
      return [...offerCategoriesToAdd, ...offerCategoryCollection];
    }
    return offerCategoryCollection;
  }
}
