import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffer } from '../offer.model';
import { OfferService } from '../service/offer.service';

@Injectable({ providedIn: 'root' })
export class OfferRoutingResolveService implements Resolve<IOffer | null> {
  constructor(protected service: OfferService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offer: HttpResponse<IOffer>) => {
          if (offer.body) {
            return of(offer.body);
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
