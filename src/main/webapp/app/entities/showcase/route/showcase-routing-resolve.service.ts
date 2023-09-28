import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShowcase } from '../showcase.model';
import { ShowcaseService } from '../service/showcase.service';

@Injectable({ providedIn: 'root' })
export class ShowcaseRoutingResolveService implements Resolve<IShowcase | null> {
  constructor(protected service: ShowcaseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShowcase | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((showcase: HttpResponse<IShowcase>) => {
          if (showcase.body) {
            return of(showcase.body);
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
