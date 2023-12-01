import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationUserOfferComponent } from './list/application-user-offer.component';
import { ApplicationUserOfferDetailComponent } from './detail/application-user-offer-detail.component';
import { ApplicationUserOfferUpdateComponent } from './update/application-user-offer-update.component';
import { ApplicationUserOfferDeleteDialogComponent } from './delete/application-user-offer-delete-dialog.component';
import { ApplicationUserOfferRoutingModule } from './route/application-user-offer-routing.module';

@NgModule({
  imports: [SharedModule, ApplicationUserOfferRoutingModule],
  declarations: [
    ApplicationUserOfferComponent,
    ApplicationUserOfferDetailComponent,
    ApplicationUserOfferUpdateComponent,
    ApplicationUserOfferDeleteDialogComponent,
  ],
})
export class KrftmeMicroserviceApplicationUserOfferModule {}
