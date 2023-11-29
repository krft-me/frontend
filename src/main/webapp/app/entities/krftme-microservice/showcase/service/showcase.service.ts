import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShowcase, NewShowcase } from '../showcase.model';

export type PartialUpdateShowcase = Partial<IShowcase> & Pick<IShowcase, 'id'>;

export type EntityResponseType = HttpResponse<IShowcase>;
export type EntityArrayResponseType = HttpResponse<IShowcase[]>;

@Injectable({ providedIn: 'root' })
export class ShowcaseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/showcases', 'krftme-microservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(showcase: NewShowcase): Observable<EntityResponseType> {
    return this.http.post<IShowcase>(this.resourceUrl, showcase, { observe: 'response' });
  }

  update(showcase: IShowcase): Observable<EntityResponseType> {
    return this.http.put<IShowcase>(`${this.resourceUrl}/${this.getShowcaseIdentifier(showcase)}`, showcase, { observe: 'response' });
  }

  partialUpdate(showcase: PartialUpdateShowcase): Observable<EntityResponseType> {
    return this.http.patch<IShowcase>(`${this.resourceUrl}/${this.getShowcaseIdentifier(showcase)}`, showcase, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShowcase>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShowcase[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShowcaseIdentifier(showcase: Pick<IShowcase, 'id'>): number {
    return showcase.id;
  }

  compareShowcase(o1: Pick<IShowcase, 'id'> | null, o2: Pick<IShowcase, 'id'> | null): boolean {
    return o1 && o2 ? this.getShowcaseIdentifier(o1) === this.getShowcaseIdentifier(o2) : o1 === o2;
  }

  addShowcaseToCollectionIfMissing<Type extends Pick<IShowcase, 'id'>>(
    showcaseCollection: Type[],
    ...showcasesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const showcases: Type[] = showcasesToCheck.filter(isPresent);
    if (showcases.length > 0) {
      const showcaseCollectionIdentifiers = showcaseCollection.map(showcaseItem => this.getShowcaseIdentifier(showcaseItem)!);
      const showcasesToAdd = showcases.filter(showcaseItem => {
        const showcaseIdentifier = this.getShowcaseIdentifier(showcaseItem);
        if (showcaseCollectionIdentifiers.includes(showcaseIdentifier)) {
          return false;
        }
        showcaseCollectionIdentifiers.push(showcaseIdentifier);
        return true;
      });
      return [...showcasesToAdd, ...showcaseCollection];
    }
    return showcaseCollection;
  }
}
