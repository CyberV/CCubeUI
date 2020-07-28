import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { CommonComponentsModule } from '../common/common.module';
import { VitalSliderComponent } from './vital-slider/vital-slider.component';
import { MnFullpageModule } from 'ngx-fullpage';

@NgModule({
  imports: [
    IonicModule.forRoot(),
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    CommonComponentsModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    MnFullpageModule.forRoot()
  ],
  declarations: [HomePage, VitalSliderComponent]
})
export class HomePageModule {}
