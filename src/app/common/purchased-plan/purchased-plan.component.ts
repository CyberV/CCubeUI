import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'purchased-plan',
  templateUrl: './purchased-plan.component.html',
  styleUrls: ['./purchased-plan.component.scss'],
})
export class PurchasedPlanComponent implements OnInit {

  @Input() car:any;
  @Input() plan:any;
  @Input() payment:any;
  @Input() subscription: any;

  @Output() compare = new EventEmitter();
  @Output() changeCar = new EventEmitter();
  @Output() renewPlan = new EventEmitter();

  showLink: boolean = false;

  expiryDate:string;
  nextPlanStartDate:string;

  constructor() { 
    this.subscription = {};
  }

  onCompare() {
    this.changeCar.emit();
  }

  onChangeCar() {
    this.changeCar.emit();
  }

  sendRenewPlan() {
    this.renewPlan.emit({
      plan: this.plan,
      car: this.car,
      payment: this.payment,
      lastDate: new Date(this.payment.expiresOn)
    });

  }

  ngOnInit() {
    this.expiryDate = new Date(this.payment.expiresOn).toString().split(' ').slice(1,3).join(' ');

    let d = new Date();
  }

  ngOnChanges(changes) {

    if (changes.payment && this.payment) {
      this.expiryDate = new Date(this.payment.expiresOn).toString().split(' ').slice(1,3).join(' ');

      if (this.payment.nextPlan) {
        this.nextPlanStartDate = new Date(this.payment.nextPlan.startDate).toString().split(' ').slice(1,3).join(' ');

      }
    }

  }

}
