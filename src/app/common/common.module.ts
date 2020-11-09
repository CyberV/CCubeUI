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

import { MatExpansionModule } from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper'
import {  MatCardModule,} from '@angular/material/card';
import { MatSelectModule} from '@angular/material/select';

import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';

import { ListComponent } from './list/list.component';
import { RsDirective } from './rs.directive';
import { CarouselComponent } from './carousel/carousel.component';
import { CheckoutDetailsComponent } from './cehckout-details/cehckout-details.component';
import { AccordionComponent } from './accordion/accordion.component';
import { AddonSliderComponent } from './addon-slider/addon-slider.component';
import { SelectedCarComponent } from './selected-car/selected-car.component';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';
import { ThanksPageComponent } from './thanks-page/thanks-page.component';
import { MenuComponent } from './menu/menu.component';
import { ConfirmLocationComponent } from './confirm-location/confirm-location.component';
import { SelectCityComponent } from './select-city/select-city.component';
import { FormsModule } from '@angular/forms';
import { PurchasedPlanComponent } from './purchased-plan/purchased-plan.component';
import { WeeklyScheduleComponent } from './weekly-schedule/weekly-schedule.component';
import { DocumentUploaderComponent } from './document-uploader/document-uploader.component';
import { SelectSocietyComponent } from './select-society/select-society.component';
import { DragListComponent } from './drag-list/drag-list.component';
import { UpgradeSliderComponent } from './upgrade-slider/upgrade-slider.component';
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
    PlanSliderComponent,
    ListComponent,
    CarouselComponent,
    CheckoutDetailsComponent,
    AccordionComponent,
    AddonSliderComponent,
    SelectedCarComponent,
    CheckoutConfirmationComponent,
    ThanksPageComponent,
    MenuComponent,
    ConfirmLocationComponent,
    SelectCityComponent,
    PurchasedPlanComponent,
    WeeklyScheduleComponent,
    DocumentUploaderComponent,
    SelectSocietyComponent,
    DragListComponent,
    UpgradeSliderComponent,

    // Directives
    RsDirective,
    

  ],
  imports: [
    IonicModule,
    CommonModule,
    ChartsModule,
    MatExpansionModule,
    MatCardModule,
    MatSelectModule,
    MatStepperModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
    FormsModule,
    MatCheckboxModule,
    
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
    PlanSliderComponent,
    ListComponent,
    CarouselComponent,
    CheckoutDetailsComponent,
    AccordionComponent,
    AddonSliderComponent,
    SelectedCarComponent,
    CheckoutConfirmationComponent,
    ThanksPageComponent,
    MenuComponent,
    ConfirmLocationComponent,
    SelectCityComponent,
    PurchasedPlanComponent,
    WeeklyScheduleComponent,
    DocumentUploaderComponent,
    SelectSocietyComponent,
    UpgradeSliderComponent,
    DragListComponent,

    //Directives

    RsDirective
  ]
})
export class CommonComponentsModule { }
