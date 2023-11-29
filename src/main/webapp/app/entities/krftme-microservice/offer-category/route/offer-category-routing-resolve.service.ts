import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOfferCategory } from '../offer-category.model';
import { OfferCategoryService } from '../service/offer-category.service';

@Injectable({ providedIn: 'root' })
export class OfferCategoryRoutingResolveService implements Resolve<IOfferCategory | null> {
  constructor(protected service: OfferCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOfferCategory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offerCategory: HttpResponse<IOfferCategory>) => {
          if (offerCategory.body) {
            return of(offerCategory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
