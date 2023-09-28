import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffer, NewOffer } from '../offer.model';

export type PartialUpdateOffer = Partial<IOffer> & Pick<IOffer, 'id'>;

export type EntityResponseType = HttpResponse<IOffer>;
export type EntityArrayResponseType = HttpResponse<IOffer[]>;

@Injectable({ providedIn: 'root' })
export class OfferService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offer: NewOffer): Observable<EntityResponseType> {
    return this.http.post<IOffer>(this.resourceUrl, offer, { observe: 'response' });
  }

  update(offer: IOffer): Observable<EntityResponseType> {
    return this.http.put<IOffer>(`${this.resourceUrl}/${this.getOfferIdentifier(offer)}`, offer, { observe: 'response' });
  }

  partialUpdate(offer: PartialUpdateOffer): Observable<EntityResponseType> {
    return this.http.patch<IOffer>(`${this.resourceUrl}/${this.getOfferIdentifier(offer)}`, offer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOfferIdentifier(offer: Pick<IOffer, 'id'>): number {
    return offer.id;
  }

  compareOffer(o1: Pick<IOffer, 'id'> | null, o2: Pick<IOffer, 'id'> | null): boolean {
    return o1 && o2 ? this.getOfferIdentifier(o1) === this.getOfferIdentifier(o2) : o1 === o2;
  }

  addOfferToCollectionIfMissing<Type extends Pick<IOffer, 'id'>>(
    offerCollection: Type[],
    ...offersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offers: Type[] = offersToCheck.filter(isPresent);
    if (offers.length > 0) {
      const offerCollectionIdentifiers = offerCollection.map(offerItem => this.getOfferIdentifier(offerItem)!);
      const offersToAdd = offers.filter(offerItem => {
        const offerIdentifier = this.getOfferIdentifier(offerItem);
        if (offerCollectionIdentifiers.includes(offerIdentifier)) {
          return false;
        }
        offerCollectionIdentifiers.push(offerIdentifier);
        return true;
      });
      return [...offersToAdd, ...offerCollection];
    }
    return offerCollection;
  }
}
