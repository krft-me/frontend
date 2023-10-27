import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OfferPackageComponent } from 'app/entities/offer-package/offer-package.component';
import { OfferDetailComponent } from 'app/entities/offer/detail/offer-detail.component';

import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [OfferDetailComponent, OfferPackageComponent],
})
export class HomeModule {}
