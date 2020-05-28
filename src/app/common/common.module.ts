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
    VerifyOtpComponent
  ],
  imports: [
    CommonModule
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
    VerifyOtpComponent
  ]
})
export class CommonComponentsModule { }
