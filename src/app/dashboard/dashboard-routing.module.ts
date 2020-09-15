import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThanksPageComponent } from 'app/common/thanks-page/thanks-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'thanks',
    component: ThanksPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
