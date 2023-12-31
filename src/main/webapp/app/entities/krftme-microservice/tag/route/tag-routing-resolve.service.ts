import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITag } from '../tag.model';
import { TagService } from '../service/tag.service';

@Injectable({ providedIn: 'root' })
export class TagRoutingResolveService implements Resolve<ITag | null> {
  constructor(protected service: TagService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITag | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tag: HttpResponse<ITag>) => {
          if (tag.body) {
            return of(tag.body);
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
