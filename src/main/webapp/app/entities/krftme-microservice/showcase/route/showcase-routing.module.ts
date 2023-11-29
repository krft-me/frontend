import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShowcaseComponent } from '../list/showcase.component';
import { ShowcaseDetailComponent } from '../detail/showcase-detail.component';
import { ShowcaseUpdateComponent } from '../update/showcase-update.component';
import { ShowcaseRoutingResolveService } from './showcase-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const showcaseRoute: Routes = [
  {
    path: '',
    component: ShowcaseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShowcaseDetailComponent,
    resolve: {
      showcase: ShowcaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShowcaseUpdateComponent,
    resolve: {
      showcase: ShowcaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShowcaseUpdateComponent,
    resolve: {
      showcase: ShowcaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(showcaseRoute)],
  exports: [RouterModule],
})
export class ShowcaseRoutingModule {}
