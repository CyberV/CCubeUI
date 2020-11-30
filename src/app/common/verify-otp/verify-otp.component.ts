import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { ToastController } from '@ionic/angular';

declare var $;
@Component({
  selector: 'verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {

  @Input() mobile:number;
  @Input() length:number;
  @Input() mismatch:boolean;

  @Output() otpSubmitted = new EventEmitter();
  @Output() changeNumber = new EventEmitter();
  @Output() resend = new EventEmitter();

  arr:any;
  private otp;

  constructor(public el: ElementRef,
    private toastController: ToastController,
    private loginService:LoginService) {
    this.mismatch = false;
   }

  ngOnInit() {
    this.arr = new Array(+this.length).fill(1);
    this.otp = new Array(+this.length).fill(0);
  }

  onClick(e) {
    e.target.select();
  }

  numberClicked() {
    this.changeNumber.emit();
  }

  ngAfterViewInit() {
    console.log('after view init');
    $('.otp-0').focus();
  }

  onChange(e) {
    let indx = +(e.target.className.split(' ')[0].split('-')[1]) + 1;
    this.otp[indx-1] = e.target.value;
    if (indx === +this.length) {
      
    } else {
      let emt = document.getElementsByClassName('otp-' + indx)[0];
      ( emt as HTMLElement).click();
    }

    let otp = this.otp.toString().replace(/,/g, "");

    if (indx==4) {
      this.otpSubmitted.emit(otp);
    }

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  resendOtp() {
    //this.resend.emit();
    this.loginService.resendOtp(this.mobile.toString()).subscribe((response:any)=>{
      if (response.success) {
        this.presentToast('OTP Resent Successfully!');
      } else {
        if (JSON.parse(response.errorMsg).message.indexOf("Max limit reached") > -1) {
          this.presentToast('MAX LIMIT Reached! Please try again after some time');
        }
      }
    });
  }

}
