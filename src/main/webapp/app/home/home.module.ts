import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import {CardComponent} from "../shared/components/card/card.component";

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), CardComponent],
  declarations: [HomeComponent],
})
export class HomeModule {}
