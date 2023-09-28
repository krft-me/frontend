import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMachine } from '../machine.model';
import { MachineService } from '../service/machine.service';

@Injectable({ providedIn: 'root' })
export class MachineRoutingResolveService implements Resolve<IMachine | null> {
  constructor(protected service: MachineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMachine | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((machine: HttpResponse<IMachine>) => {
          if (machine.body) {
            return of(machine.body);
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
