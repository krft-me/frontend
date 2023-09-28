import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationUserBadgeComponent } from './list/application-user-badge.component';
import { ApplicationUserBadgeDetailComponent } from './detail/application-user-badge-detail.component';
import { ApplicationUserBadgeUpdateComponent } from './update/application-user-badge-update.component';
import { ApplicationUserBadgeDeleteDialogComponent } from './delete/application-user-badge-delete-dialog.component';
import { ApplicationUserBadgeRoutingModule } from './route/application-user-badge-routing.module';

@NgModule({
  imports: [SharedModule, ApplicationUserBadgeRoutingModule],
  declarations: [
    ApplicationUserBadgeComponent,
    ApplicationUserBadgeDetailComponent,
    ApplicationUserBadgeUpdateComponent,
    ApplicationUserBadgeDeleteDialogComponent,
  ],
})
export class ApplicationUserBadgeModule {}
