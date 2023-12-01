import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MachineCategoryComponent } from './list/machine-category.component';
import { MachineCategoryDetailComponent } from './detail/machine-category-detail.component';
import { MachineCategoryUpdateComponent } from './update/machine-category-update.component';
import { MachineCategoryDeleteDialogComponent } from './delete/machine-category-delete-dialog.component';
import { MachineCategoryRoutingModule } from './route/machine-category-routing.module';

@NgModule({
  imports: [SharedModule, MachineCategoryRoutingModule],
  declarations: [
    MachineCategoryComponent,
    MachineCategoryDetailComponent,
    MachineCategoryUpdateComponent,
    MachineCategoryDeleteDialogComponent,
  ],
})
export class KrftmeMicroserviceMachineCategoryModule {}
