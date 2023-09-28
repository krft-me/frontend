import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplicationUserOffer, NewApplicationUserOffer } from '../application-user-offer.model';

export type PartialUpdateApplicationUserOffer = Partial<IApplicationUserOffer> & Pick<IApplicationUserOffer, 'id'>;

export type EntityResponseType = HttpResponse<IApplicationUserOffer>;
export type EntityArrayResponseType = HttpResponse<IApplicationUserOffer[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserOfferService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/application-user-offers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(applicationUserOffer: NewApplicationUserOffer): Observable<EntityResponseType> {
    return this.http.post<IApplicationUserOffer>(this.resourceUrl, applicationUserOffer, { observe: 'response' });
  }

  update(applicationUserOffer: IApplicationUserOffer): Observable<EntityResponseType> {
    return this.http.put<IApplicationUserOffer>(
      `${this.resourceUrl}/${this.getApplicationUserOfferIdentifier(applicationUserOffer)}`,
      applicationUserOffer,
      { observe: 'response' }
    );
  }

  partialUpdate(applicationUserOffer: PartialUpdateApplicationUserOffer): Observable<EntityResponseType> {
    return this.http.patch<IApplicationUserOffer>(
      `${this.resourceUrl}/${this.getApplicationUserOfferIdentifier(applicationUserOffer)}`,
      applicationUserOffer,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IApplicationUserOffer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IApplicationUserOffer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getApplicationUserOfferIdentifier(applicationUserOffer: Pick<IApplicationUserOffer, 'id'>): number {
    return applicationUserOffer.id;
  }

  compareApplicationUserOffer(o1: Pick<IApplicationUserOffer, 'id'> | null, o2: Pick<IApplicationUserOffer, 'id'> | null): boolean {
    return o1 && o2 ? this.getApplicationUserOfferIdentifier(o1) === this.getApplicationUserOfferIdentifier(o2) : o1 === o2;
  }

  addApplicationUserOfferToCollectionIfMissing<Type extends Pick<IApplicationUserOffer, 'id'>>(
    applicationUserOfferCollection: Type[],
    ...applicationUserOffersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const applicationUserOffers: Type[] = applicationUserOffersToCheck.filter(isPresent);
    if (applicationUserOffers.length > 0) {
      const applicationUserOfferCollectionIdentifiers = applicationUserOfferCollection.map(
        applicationUserOfferItem => this.getApplicationUserOfferIdentifier(applicationUserOfferItem)!
      );
      const applicationUserOffersToAdd = applicationUserOffers.filter(applicationUserOfferItem => {
        const applicationUserOfferIdentifier = this.getApplicationUserOfferIdentifier(applicationUserOfferItem);
        if (applicationUserOfferCollectionIdentifiers.includes(applicationUserOfferIdentifier)) {
          return false;
        }
        applicationUserOfferCollectionIdentifiers.push(applicationUserOfferIdentifier);
        return true;
      });
      return [...applicationUserOffersToAdd, ...applicationUserOfferCollection];
    }
    return applicationUserOfferCollection;
  }
}
