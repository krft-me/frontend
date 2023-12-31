import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApplicationUser } from '../application-user.model';
import { ApplicationUserService } from '../service/application-user.service';

@Injectable({ providedIn: 'root' })
export class ApplicationUserRoutingResolveService implements Resolve<IApplicationUser | null> {
  constructor(protected service: ApplicationUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((applicationUser: HttpResponse<IApplicationUser>) => {
          if (applicationUser.body) {
            return of(applicationUser.body);
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
