import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRating } from '../rating.model';
import { RatingService } from '../service/rating.service';

@Injectable({ providedIn: 'root' })
export class RatingRoutingResolveService implements Resolve<IRating | null> {
  constructor(protected service: RatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRating | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rating: HttpResponse<IRating>) => {
          if (rating.body) {
            return of(rating.body);
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
