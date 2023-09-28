import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'city',
        data: { pageTitle: 'krftmeApp.city.home.title' },
        loadChildren: () => import('./city/city.module').then(m => m.CityModule),
      },
      {
        path: 'region',
        data: { pageTitle: 'krftmeApp.region.home.title' },
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
      },
      {
        path: 'country',
        data: { pageTitle: 'krftmeApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'application-user',
        data: { pageTitle: 'krftmeApp.applicationUser.home.title' },
        loadChildren: () => import('./application-user/application-user.module').then(m => m.ApplicationUserModule),
      },
      {
        path: 'rating',
        data: { pageTitle: 'krftmeApp.rating.home.title' },
        loadChildren: () => import('./rating/rating.module').then(m => m.RatingModule),
      },
      {
        path: 'machine',
        data: { pageTitle: 'krftmeApp.machine.home.title' },
        loadChildren: () => import('./machine/machine.module').then(m => m.MachineModule),
      },
      {
        path: 'offer',
        data: { pageTitle: 'krftmeApp.offer.home.title' },
        loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule),
      },
      {
        path: 'application-user-offer',
        data: { pageTitle: 'krftmeApp.applicationUserOffer.home.title' },
        loadChildren: () => import('./application-user-offer/application-user-offer.module').then(m => m.ApplicationUserOfferModule),
      },
      {
        path: 'showcase',
        data: { pageTitle: 'krftmeApp.showcase.home.title' },
        loadChildren: () => import('./showcase/showcase.module').then(m => m.ShowcaseModule),
      },
      {
        path: 'badge',
        data: { pageTitle: 'krftmeApp.badge.home.title' },
        loadChildren: () => import('./badge/badge.module').then(m => m.BadgeModule),
      },
      {
        path: 'application-user-badge',
        data: { pageTitle: 'krftmeApp.applicationUserBadge.home.title' },
        loadChildren: () => import('./application-user-badge/application-user-badge.module').then(m => m.ApplicationUserBadgeModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'krftmeApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'krftmeApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'krftmeApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
