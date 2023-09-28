import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MachineComponent } from './list/machine.component';
import { MachineDetailComponent } from './detail/machine-detail.component';
import { MachineUpdateComponent } from './update/machine-update.component';
import { MachineDeleteDialogComponent } from './delete/machine-delete-dialog.component';
import { MachineRoutingModule } from './route/machine-routing.module';

@NgModule({
  imports: [SharedModule, MachineRoutingModule],
  declarations: [MachineComponent, MachineDetailComponent, MachineUpdateComponent, MachineDeleteDialogComponent],
})
export class MachineModule {}
