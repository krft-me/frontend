import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ApplicationUserBadgeComponent } from '../list/application-user-badge.component';
import { ApplicationUserBadgeDetailComponent } from '../detail/application-user-badge-detail.component';
import { ApplicationUserBadgeUpdateComponent } from '../update/application-user-badge-update.component';
import { ApplicationUserBadgeRoutingResolveService } from './application-user-badge-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const applicationUserBadgeRoute: Routes = [
  {
    path: '',
    component: ApplicationUserBadgeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationUserBadgeDetailComponent,
    resolve: {
      applicationUserBadge: ApplicationUserBadgeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationUserBadgeUpdateComponent,
    resolve: {
      applicationUserBadge: ApplicationUserBadgeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationUserBadgeUpdateComponent,
    resolve: {
      applicationUserBadge: ApplicationUserBadgeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(applicationUserBadgeRoute)],
  exports: [RouterModule],
})
export class ApplicationUserBadgeRoutingModule {}
