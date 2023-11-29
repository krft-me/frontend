import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "city",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceCity.home.title" },
        loadChildren: () => import("./krftme-microservice/city/city.module").then(m => m.KrftmeMicroserviceCityModule)
      },
      {
        path: "region"',
        data: {
          pageTitle: "krftmeApp.krftmeMicroserviceRegion.home.title"
          ' },
          loadChildren: () =>
          import"./krftme-microservice/region/region.module"
          ').then(m => m.KrftmeMicroserviceRegionModule,
        }
      {
        path: "country",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceCountry.home.title" },
        loadChildren: () => import("./krftme-microservice/country/country.module").then(m => m.KrftmeMicroserviceCountryModule)
      },
      {
        path: "application-user",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceApplicationUser.home.title" },
        loadChildren: () =>
          import("./krftme-microservice/application-user/application-user.module").then(m => m.KrftmeMicroserviceApplicationUserModule)
      },
      {
        path: "review",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceReview.home.title" },
        loadChildren: () => import("./krftme-microservice/review/review.module").then(m => m.KrftmeMicroserviceReviewModule)
      },
      {
        path: "machine",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceMachine.home.title" },
        loadChildren: () => import("./krftme-microservice/machine/machine.module").then(m => m.KrftmeMicroserviceMachineModule)
      },
      {
        path: "offer",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceOffer.home.title" },
        loadChildren: () => import("./krftme-microservice/offer/offer.module").then(m => m.KrftmeMicroserviceOfferModule)
      },
      {
        path: "application-user-offer",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceApplicationUserOffer.home.title" },
        loadChildren: () =>
          import("./krftme-microservice/application-user-offer/application-user-offer.module").then(
            m => m.KrftmeMicroserviceApplicationUserOfferModule
          )
      },
      {
        path: "showcase",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceShowcase.home.title" },
        loadChildren: () => import("./krftme-microservice/showcase/showcase.module").then(m => m.KrftmeMicroserviceShowcaseModule)
      },
      {
        path: "badge",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceBadge.home.title" },
        loadChildren: () => import("./krftme-microservice/badge/badge.module").then(m => m.KrftmeMicroserviceBadgeModule)
      },
      {
        path: "application-user-badge",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceApplicationUserBadge.home.title" },
        loadChildren: () =>
          import("./krftme-microservice/application-user-badge/application-user-badge.module").then(
            m => m.KrftmeMicroserviceApplicationUserBadgeModule
          )
      },
      {
        path: "order",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceOrder.home.title" },
        loadChildren: () => import("./krftme-microservice/order/order.module").then(m => m.KrftmeMicroserviceOrderModule)
      },
      {
        path: "tag",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceTag.home.title" },
        loadChildren: () => import("./krftme-microservice/tag/tag.module").then(m => m.KrftmeMicroserviceTagModule)
      },
      {
        path: "machine-category",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceMachineCategory.home.title" },
        loadChildren: () =>
          import("./krftme-microservice/machine-category/machine-category.module").then(m => m.KrftmeMicroserviceMachineCategoryModule)
      },
      {
        path: "offer-category",
        data: { pageTitle: "krftmeApp.krftmeMicroserviceOfferCategory.home.title" },
        loadChildren: () =>
          import("./krftme-microservice/offer-category/offer-category.module").then(m => m.KrftmeMicroserviceOfferCategoryModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
