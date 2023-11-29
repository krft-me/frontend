import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';

@NgModule({
  imports: [RouterModule.forRoot([navbarRoute, ...errorRoute], { enableTracing: DEBUG_INFO_ENABLED })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
