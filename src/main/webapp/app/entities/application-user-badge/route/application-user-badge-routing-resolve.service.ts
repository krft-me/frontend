import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApplicationUserBadge } from '../application-user-badge.model';
import { ApplicationUserBadgeService } from '../service/application-user-badge.service';

@Injectable({ providedIn: 'root' })
export class ApplicationUserBadgeRoutingResolveService implements Resolve<IApplicationUserBadge | null> {
  constructor(protected service: ApplicationUserBadgeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationUserBadge | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((applicationUserBadge: HttpResponse<IApplicationUserBadge>) => {
          if (applicationUserBadge.body) {
            return of(applicationUserBadge.body);
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
