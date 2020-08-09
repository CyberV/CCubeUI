import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { IconComponent } from './icon/icon.component';
import { HeadingComponent } from './heading/heading.component';
import { SubheadingComponent } from './subheading/subheading.component';
import { MobileInputComponent } from './mobile-input/mobile-input.component';
import { CtaComponent } from './cta/cta.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HighlightDirective } from './highlight.directive';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ChartComponent } from './chart/chart.component';
import { TooltipModule } from 'ng2-tooltip-directive';

import { ChartsModule } from 'ng2-charts';
import { ChartViewComponent } from './chart-view/chart-view.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { DemoComponent } from './demo/demo.component';
import { SlideComponent } from './slide/slide.component';
import { TipsViewComponent } from './tips-view/tips-view.component';
import { TypeawayComponent } from './typeaway/typeaway.component'
import { DropBombComponent } from './drop-bomb/drop-bomb.component';
import { TextInputComponent } from './text-input/text-input.component';
import { FeatureCardComponent } from './feature-card/feature-card.component';
import { FeatureAvail } from './feature-avail/feature-avail.component';
import { RouterModule } from '@angular/router';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { SelectCarComponent } from './select-car/select-car.component';
import { CarDisplayComponent } from './car-display/car-display.component';
import { PlanTableComponent } from './plan-table/plan-table.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { PlanCardComponent } from './plan-card/plan-card.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { PlanSliderComponent } from './plan-slider/plan-slider.component';


@NgModule({
  declarations: [
    NavbarComponent,
    IconComponent,
    HeadingComponent,
    SubheadingComponent,
    MobileInputComponent,
    CtaComponent,
    SpinnerComponent,
    HighlightDirective,
    VerifyOtpComponent,
    ChartComponent,
    IndicatorComponent,
    ChartViewComponent,
    DemoComponent,
    SlideComponent,
    TipsViewComponent,
    TypeawayComponent,
    DropBombComponent,
    TextInputComponent,
    FeatureCardComponent,
    FeatureAvail,
    TypeaheadComponent,
    SelectCarComponent,
    CarDisplayComponent,
    PlanTableComponent,
    MobileNavComponent,
    PlanCardComponent,
    PlanDetailsComponent,
    PlanSliderComponent

  ],
  imports: [
    IonicModule,
    CommonModule,
    ChartsModule,
    TooltipModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    IconComponent,
    HeadingComponent,
    SubheadingComponent,
    MobileInputComponent,
    CtaComponent,
    SpinnerComponent,
    HighlightDirective,
    VerifyOtpComponent,
    ChartComponent,
    IndicatorComponent,
    ChartViewComponent,
    DemoComponent,
    SlideComponent,
    TipsViewComponent,
    TypeawayComponent,
    DropBombComponent,
    TextInputComponent,
    FeatureCardComponent,
    FeatureAvail,
    TypeaheadComponent,
    SelectCarComponent,
    CarDisplayComponent,
    PlanTableComponent,
    MobileNavComponent,
    PlanCardComponent,
    PlanDetailsComponent,
    PlanSliderComponent
  ]
})
export class CommonComponentsModule { }
