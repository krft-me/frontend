import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplicationUserBadge, NewApplicationUserBadge } from '../application-user-badge.model';

export type PartialUpdateApplicationUserBadge = Partial<IApplicationUserBadge> & Pick<IApplicationUserBadge, 'id'>;

type RestOf<T extends IApplicationUserBadge | NewApplicationUserBadge> = Omit<T, 'obtainedDate'> & {
  obtainedDate?: string | null;
};

export type RestApplicationUserBadge = RestOf<IApplicationUserBadge>;

export type NewRestApplicationUserBadge = RestOf<NewApplicationUserBadge>;

export type PartialUpdateRestApplicationUserBadge = RestOf<PartialUpdateApplicationUserBadge>;

export type EntityResponseType = HttpResponse<IApplicationUserBadge>;
export type EntityArrayResponseType = HttpResponse<IApplicationUserBadge[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserBadgeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/application-user-badges', 'krftme-microservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(applicationUserBadge: NewApplicationUserBadge): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationUserBadge);
    return this.http
      .post<RestApplicationUserBadge>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(applicationUserBadge: IApplicationUserBadge): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationUserBadge);
    return this.http
      .put<RestApplicationUserBadge>(`${this.resourceUrl}/${this.getApplicationUserBadgeIdentifier(applicationUserBadge)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(applicationUserBadge: PartialUpdateApplicationUserBadge): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationUserBadge);
    return this.http
      .patch<RestApplicationUserBadge>(`${this.resourceUrl}/${this.getApplicationUserBadgeIdentifier(applicationUserBadge)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestApplicationUserBadge>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestApplicationUserBadge[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getApplicationUserBadgeIdentifier(applicationUserBadge: Pick<IApplicationUserBadge, 'id'>): number {
    return applicationUserBadge.id;
  }

  compareApplicationUserBadge(o1: Pick<IApplicationUserBadge, 'id'> | null, o2: Pick<IApplicationUserBadge, 'id'> | null): boolean {
    return o1 && o2 ? this.getApplicationUserBadgeIdentifier(o1) === this.getApplicationUserBadgeIdentifier(o2) : o1 === o2;
  }

  addApplicationUserBadgeToCollectionIfMissing<Type extends Pick<IApplicationUserBadge, 'id'>>(
    applicationUserBadgeCollection: Type[],
    ...applicationUserBadgesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const applicationUserBadges: Type[] = applicationUserBadgesToCheck.filter(isPresent);
    if (applicationUserBadges.length > 0) {
      const applicationUserBadgeCollectionIdentifiers = applicationUserBadgeCollection.map(
        applicationUserBadgeItem => this.getApplicationUserBadgeIdentifier(applicationUserBadgeItem)!
      );
      const applicationUserBadgesToAdd = applicationUserBadges.filter(applicationUserBadgeItem => {
        const applicationUserBadgeIdentifier = this.getApplicationUserBadgeIdentifier(applicationUserBadgeItem);
        if (applicationUserBadgeCollectionIdentifiers.includes(applicationUserBadgeIdentifier)) {
          return false;
        }
        applicationUserBadgeCollectionIdentifiers.push(applicationUserBadgeIdentifier);
        return true;
      });
      return [...applicationUserBadgesToAdd, ...applicationUserBadgeCollection];
    }
    return applicationUserBadgeCollection;
  }

  protected convertDateFromClient<T extends IApplicationUserBadge | NewApplicationUserBadge | PartialUpdateApplicationUserBadge>(
    applicationUserBadge: T
  ): RestOf<T> {
    return {
      ...applicationUserBadge,
      obtainedDate: applicationUserBadge.obtainedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restApplicationUserBadge: RestApplicationUserBadge): IApplicationUserBadge {
    return {
      ...restApplicationUserBadge,
      obtainedDate: restApplicationUserBadge.obtainedDate ? dayjs(restApplicationUserBadge.obtainedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestApplicationUserBadge>): HttpResponse<IApplicationUserBadge> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestApplicationUserBadge[]>): HttpResponse<IApplicationUserBadge[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
