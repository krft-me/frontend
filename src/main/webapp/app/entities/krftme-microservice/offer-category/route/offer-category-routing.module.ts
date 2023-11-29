import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OfferCategoryComponent } from '../list/offer-category.component';
import { OfferCategoryDetailComponent } from '../detail/offer-category-detail.component';
import { OfferCategoryUpdateComponent } from '../update/offer-category-update.component';
import { OfferCategoryRoutingResolveService } from './offer-category-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const offerCategoryRoute: Routes = [
  {
    path: '',
    component: OfferCategoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OfferCategoryDetailComponent,
    resolve: {
      offerCategory: OfferCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OfferCategoryUpdateComponent,
    resolve: {
      offerCategory: OfferCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OfferCategoryUpdateComponent,
    resolve: {
      offerCategory: OfferCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offerCategoryRoute)],
  exports: [RouterModule],
})
export class OfferCategoryRoutingModule {}
