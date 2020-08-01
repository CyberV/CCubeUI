import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonComponentsModule } from 'app/common/common.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarFormComponent } from './car-form/car-form.component';




@NgModule({
  declarations: [ 
    DashboardPageComponent, 
    DashboardComponent,
    CarFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    CommonComponentsModule,
    DashboardPageRoutingModule,

  ]
})
export class DashboardModule { }
