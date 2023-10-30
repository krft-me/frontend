import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OFFERS_ROUTE } from './offers.route';
import { SharedModule } from '../shared/shared.module';
import { OffersComponent } from './offers.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([OFFERS_ROUTE])],
  declarations: [OffersComponent],
})
export class OffersModule {}
