import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OfferComponent } from './list/offer.component';
import { OfferDetailComponent } from './detail/offer-detail.component';
import { OfferUpdateComponent } from './update/offer-update.component';
import { OfferDeleteDialogComponent } from './delete/offer-delete-dialog.component';
import { OfferRoutingModule } from './route/offer-routing.module';

@NgModule({
  imports: [SharedModule, OfferRoutingModule],
  declarations: [OfferComponent, OfferDetailComponent, OfferUpdateComponent, OfferDeleteDialogComponent],
})
export class KrftmeMicroserviceOfferModule {}
