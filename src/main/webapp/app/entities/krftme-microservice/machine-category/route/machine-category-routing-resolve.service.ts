import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMachineCategory } from '../machine-category.model';
import { MachineCategoryService } from '../service/machine-category.service';

@Injectable({ providedIn: 'root' })
export class MachineCategoryRoutingResolveService implements Resolve<IMachineCategory | null> {
  constructor(protected service: MachineCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMachineCategory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((machineCategory: HttpResponse<IMachineCategory>) => {
          if (machineCategory.body) {
            return of(machineCategory.body);
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
