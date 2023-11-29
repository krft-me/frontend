import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShowcaseComponent } from './list/showcase.component';
import { ShowcaseDetailComponent } from './detail/showcase-detail.component';
import { ShowcaseUpdateComponent } from './update/showcase-update.component';
import { ShowcaseDeleteDialogComponent } from './delete/showcase-delete-dialog.component';
import { ShowcaseRoutingModule } from './route/showcase-routing.module';

@NgModule({
  imports: [SharedModule, ShowcaseRoutingModule],
  declarations: [ShowcaseComponent, ShowcaseDetailComponent, ShowcaseUpdateComponent, ShowcaseDeleteDialogComponent],
})
export class KrftmeMicroserviceShowcaseModule {}
