import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICity } from '../city.model';
import { CityService } from '../service/city.service';

@Injectable({ providedIn: 'root' })
export class CityRoutingResolveService implements Resolve<ICity | null> {
  constructor(protected service: CityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((city: HttpResponse<ICity>) => {
          if (city.body) {
            return of(city.body);
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
