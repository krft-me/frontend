import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MachineCategoryComponent } from '../list/machine-category.component';
import { MachineCategoryDetailComponent } from '../detail/machine-category-detail.component';
import { MachineCategoryUpdateComponent } from '../update/machine-category-update.component';
import { MachineCategoryRoutingResolveService } from './machine-category-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const machineCategoryRoute: Routes = [
  {
    path: '',
    component: MachineCategoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MachineCategoryDetailComponent,
    resolve: {
      machineCategory: MachineCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MachineCategoryUpdateComponent,
    resolve: {
      machineCategory: MachineCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MachineCategoryUpdateComponent,
    resolve: {
      machineCategory: MachineCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(machineCategoryRoute)],
  exports: [RouterModule],
})
export class MachineCategoryRoutingModule {}
