import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBadge, NewBadge } from '../badge.model';

export type PartialUpdateBadge = Partial<IBadge> & Pick<IBadge, 'id'>;

export type EntityResponseType = HttpResponse<IBadge>;
export type EntityArrayResponseType = HttpResponse<IBadge[]>;

@Injectable({ providedIn: 'root' })
export class BadgeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/badges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(badge: NewBadge): Observable<EntityResponseType> {
    return this.http.post<IBadge>(this.resourceUrl, badge, { observe: 'response' });
  }

  update(badge: IBadge): Observable<EntityResponseType> {
    return this.http.put<IBadge>(`${this.resourceUrl}/${this.getBadgeIdentifier(badge)}`, badge, { observe: 'response' });
  }

  partialUpdate(badge: PartialUpdateBadge): Observable<EntityResponseType> {
    return this.http.patch<IBadge>(`${this.resourceUrl}/${this.getBadgeIdentifier(badge)}`, badge, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBadge>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBadge[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBadgeIdentifier(badge: Pick<IBadge, 'id'>): number {
    return badge.id;
  }

  compareBadge(o1: Pick<IBadge, 'id'> | null, o2: Pick<IBadge, 'id'> | null): boolean {
    return o1 && o2 ? this.getBadgeIdentifier(o1) === this.getBadgeIdentifier(o2) : o1 === o2;
  }

  addBadgeToCollectionIfMissing<Type extends Pick<IBadge, 'id'>>(
    badgeCollection: Type[],
    ...badgesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const badges: Type[] = badgesToCheck.filter(isPresent);
    if (badges.length > 0) {
      const badgeCollectionIdentifiers = badgeCollection.map(badgeItem => this.getBadgeIdentifier(badgeItem)!);
      const badgesToAdd = badges.filter(badgeItem => {
        const badgeIdentifier = this.getBadgeIdentifier(badgeItem);
        if (badgeCollectionIdentifiers.includes(badgeIdentifier)) {
          return false;
        }
        badgeCollectionIdentifiers.push(badgeIdentifier);
        return true;
      });
      return [...badgesToAdd, ...badgeCollection];
    }
    return badgeCollection;
  }
}
