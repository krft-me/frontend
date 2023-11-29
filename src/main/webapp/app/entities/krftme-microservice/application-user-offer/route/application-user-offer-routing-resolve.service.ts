import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApplicationUserOffer } from '../application-user-offer.model';
import { ApplicationUserOfferService } from '../service/application-user-offer.service';

@Injectable({ providedIn: 'root' })
export class ApplicationUserOfferRoutingResolveService implements Resolve<IApplicationUserOffer | null> {
  constructor(protected service: ApplicationUserOfferService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationUserOffer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((applicationUserOffer: HttpResponse<IApplicationUserOffer>) => {
          if (applicationUserOffer.body) {
            return of(applicationUserOffer.body);
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
