import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MachineComponent } from '../list/machine.component';
import { MachineDetailComponent } from '../detail/machine-detail.component';
import { MachineUpdateComponent } from '../update/machine-update.component';
import { MachineRoutingResolveService } from './machine-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const machineRoute: Routes = [
  {
    path: '',
    component: MachineComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MachineDetailComponent,
    resolve: {
      machine: MachineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MachineUpdateComponent,
    resolve: {
      machine: MachineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MachineUpdateComponent,
    resolve: {
      machine: MachineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(machineRoute)],
  exports: [RouterModule],
})
export class MachineRoutingModule {}
