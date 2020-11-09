import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonComponentsModule } from 'app/common/common.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarFormComponent } from './car-form/car-form.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AccordionModule } from 'ngx-accordion';
import {MatExpansionModule} from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ServicePageComponent } from './service-page/service-page.component';

@NgModule({
  declarations: [ 
    DashboardPageComponent, 
    DashboardComponent,
    CarFormComponent,
    CheckoutComponent,
    ServicePageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    DragDropModule,
    IonicModule,
    AccordionModule,
    NgxMaterialTimepickerModule,

    CommonComponentsModule,
    DashboardPageRoutingModule,

  ]
})
export class DashboardModule { }
