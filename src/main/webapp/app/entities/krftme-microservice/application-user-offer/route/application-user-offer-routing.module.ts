import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ApplicationUserOfferComponent } from '../list/application-user-offer.component';
import { ApplicationUserOfferDetailComponent } from '../detail/application-user-offer-detail.component';
import { ApplicationUserOfferUpdateComponent } from '../update/application-user-offer-update.component';
import { ApplicationUserOfferRoutingResolveService } from './application-user-offer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const applicationUserOfferRoute: Routes = [
  {
    path: '',
    component: ApplicationUserOfferComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationUserOfferDetailComponent,
    resolve: {
      applicationUserOffer: ApplicationUserOfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationUserOfferUpdateComponent,
    resolve: {
      applicationUserOffer: ApplicationUserOfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationUserOfferUpdateComponent,
    resolve: {
      applicationUserOffer: ApplicationUserOfferRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(applicationUserOfferRoute)],
  exports: [RouterModule],
})
export class ApplicationUserOfferRoutingModule {}
