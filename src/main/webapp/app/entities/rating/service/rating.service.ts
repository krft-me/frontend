import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRating, NewRating } from '../rating.model';

export type PartialUpdateRating = Partial<IRating> & Pick<IRating, 'id'>;

export type EntityResponseType = HttpResponse<IRating>;
export type EntityArrayResponseType = HttpResponse<IRating[]>;

@Injectable({ providedIn: 'root' })
export class RatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rating: NewRating): Observable<EntityResponseType> {
    return this.http.post<IRating>(this.resourceUrl, rating, { observe: 'response' });
  }

  update(rating: IRating): Observable<EntityResponseType> {
    return this.http.put<IRating>(`${this.resourceUrl}/${this.getRatingIdentifier(rating)}`, rating, { observe: 'response' });
  }

  partialUpdate(rating: PartialUpdateRating): Observable<EntityResponseType> {
    return this.http.patch<IRating>(`${this.resourceUrl}/${this.getRatingIdentifier(rating)}`, rating, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRating>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRatingIdentifier(rating: Pick<IRating, 'id'>): number {
    return rating.id;
  }

  compareRating(o1: Pick<IRating, 'id'> | null, o2: Pick<IRating, 'id'> | null): boolean {
    return o1 && o2 ? this.getRatingIdentifier(o1) === this.getRatingIdentifier(o2) : o1 === o2;
  }

  addRatingToCollectionIfMissing<Type extends Pick<IRating, 'id'>>(
    ratingCollection: Type[],
    ...ratingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ratings: Type[] = ratingsToCheck.filter(isPresent);
    if (ratings.length > 0) {
      const ratingCollectionIdentifiers = ratingCollection.map(ratingItem => this.getRatingIdentifier(ratingItem)!);
      const ratingsToAdd = ratings.filter(ratingItem => {
        const ratingIdentifier = this.getRatingIdentifier(ratingItem);
        if (ratingCollectionIdentifiers.includes(ratingIdentifier)) {
          return false;
        }
        ratingCollectionIdentifiers.push(ratingIdentifier);
        return true;
      });
      return [...ratingsToAdd, ...ratingCollection];
    }
    return ratingCollection;
  }
}
