import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

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

  arr:any;
  private otp;

  constructor(public el: ElementRef) {
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

  onChange(e) {
    let indx = +(e.target.className.split(' ')[0].split('-')[1]) + 1;
    this.otp[indx-1] = e.target.value;
    if (indx === +this.length) {
      
    } else {
      let emt = document.getElementsByClassName('otp-' + indx)[0];
      ( emt as HTMLElement).click();
    }

    let otp = this.otp.toString().replace(/,/g, "");
    this.otpSubmitted.emit(otp);

  }

}
