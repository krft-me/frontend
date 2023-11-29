import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OfferCategoryComponent } from './list/offer-category.component';
import { OfferCategoryDetailComponent } from './detail/offer-category-detail.component';
import { OfferCategoryUpdateComponent } from './update/offer-category-update.component';
import { OfferCategoryDeleteDialogComponent } from './delete/offer-category-delete-dialog.component';
import { OfferCategoryRoutingModule } from './route/offer-category-routing.module';

@NgModule({
  imports: [SharedModule, OfferCategoryRoutingModule],
  declarations: [OfferCategoryComponent, OfferCategoryDetailComponent, OfferCategoryUpdateComponent, OfferCategoryDeleteDialogComponent],
})
export class KrftmeMicroserviceOfferCategoryModule {}
