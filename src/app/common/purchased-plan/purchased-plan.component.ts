import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompileMetadataResolver } from '@angular/compiler';
import { NotificationService } from 'app/services/notification.service';

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
  startDate:string;
  nextPlanStartDate:string;
  expiry:string;


  constructor(  ) { 
    this.expiry = "";
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
  }

  ngOnChanges(changes) {

    if (changes.payment && this.payment) {
      this.expiryDate = new Date(this.payment.expiresOn).toString().split(' ').slice(1,3).join(' ');
      this.startDate = new Date(this.payment.startDate).toString().split(' ').slice(1,3).join(' ');
      if (this.payment.nextPlan) {
        this.nextPlanStartDate = new Date(this.payment.nextPlan.startDate).toString().split(' ').slice(1,3).join(' ');

      }
    }

    if (this.subscription) {
      let {status} = this.subscription;
      
      switch (status) {
        case'Ready': {

          break;
        }
        case 'Payment Received': {
          this.expiry = "Under Processing"
          break;
        }
        case 'Service Scheduled': {
          this.expiry = "Starts on " + this.startDate;
          break;
        }
        case 'Active': {
          this.expiry = "Expires on " + this.expiryDate;
          break;
        }
        case 'Expiring': {
          this.expiry = "Expires on " + this.expiryDate;
          break;
        }
        case 'Expired': {
          this.expiry = "Expired on " + this.expiryDate;
          break;
        }
        case 'Terminated': {
          this.expiry = "Services Stopped";
          break;
        }
        case 'Old Customer': {
          this.expiry = "Welcome Back!";
          break;
        }
      }
    }

  }

}
