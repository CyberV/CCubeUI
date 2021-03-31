import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompileMetadataResolver } from '@angular/compiler';
import { NotificationService } from 'app/services/notification.service';
import { prettyDate } from 'app/util/util';
import { PlanService } from 'app/services/plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'purchased-plan',
  templateUrl: './purchased-plan.component.html',
  styleUrls: ['./purchased-plan.component.scss'],
})
export class PurchasedPlanComponent implements OnInit {

  @Input() car: any;
  @Input() plan: any;
  @Input() payment: any;
  @Input() subscription: any;

  @Output() compare = new EventEmitter();
  @Output() changeCar = new EventEmitter();
  @Output() renewPlan = new EventEmitter();
  @Output() scheduleService = new EventEmitter();

  showLink: boolean = false;

  expiryDate: string;
  startDate: string;
  nextPlanStartDate: string;
  expiry: string;

  mode: string;

  adhoc: any;

  pretty:any;

  constructor(
    private planService:PlanService,
    private router: Router
  ) {
    this.expiry = "";
    this.mode = "plan";
    this.pretty = prettyDate;
  }

  onCompare() {
    this.changeCar.emit();
  }

  onChangeCar() {
    this.changeCar.emit();
  }

  goToPlan() {
    this.planService.changePlan(this.plan);
    this.router.navigate(['/dashboard/plan']);
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
    this.expiryDate = new Date(this.payment.expiresOn).toString().split(' ').slice(1, 3).join(' ');
  }

  ngOnChanges(changes) {

    if (this.subscription) {
      let { isAdhoc, adhocs } = this.subscription;
      this.mode = isAdhoc && adhocs.length ? 'adhoc' : 'plan';
      if (this.mode == 'adhoc') {
        this.selectAdhoc(adhocs[0]);
        this.refreshStatus();
      }
    }

    if (changes.payment && this.payment) {
      if (this.mode == 'plan') {
        this.expiryDate = new Date(this.payment.expiresOn).toString().split(' ').slice(1, 3).join(' ');
        this.startDate = new Date(this.payment.startDate).toString().split(' ').slice(1, 3).join(' ');
        if (this.payment.nextPlan) {
          this.nextPlanStartDate = new Date(this.payment.nextPlan.startDate).toString().split(' ').slice(1, 3).join(' ');
        }
    }
  }

    if (changes.subscription && this.subscription) {
      
      this.mode = this.subscription.isAdhoc ? 'adhoc' : 'plan';
      this.mode == 'plan' ?'' : this.selectAdhoc(this.adhoc ? this.adhoc : this.subscription.adhocs[0]) ;
      this.refreshStatus();
    }
  };

  refreshStatus() {
    if (this.mode == 'plan') {
      switch (this.subscription.status) {
        case 'Ready': {

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
    } else if (this.mode == 'adhoc') {
      this.expiryDate = new Date(this.adhoc.expiresOn).toString().split(' ').slice(1, 3).join(' ');
      this.startDate = new Date(this.adhoc.scheduledTime || this.payment.startDate).toString().split(' ').slice(1, 3).join(' ');
   
      switch (this.subscription.status) {
        case "Purchased": {
          this.expiry = "Expires on " + this.expiryDate;
          break;
        }
        case "Scheduled": {
          this.expiry = "Scheduled on " + this.startDate;
          break;
        }
        case "Active": {
          this.expiry = "Scheduled for today!";
          break;
        }
        case "Missed": {
          this.expiry = "Reschedule before " + this.expiryDate;
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
      }
    }
  }

  selectAdhoc(adhoc) {
    let adhocName = adhoc.detail ? adhoc.detail.value : adhoc.addon.name;
    let found = this.subscription.adhocs.filter((adh) => adh.addon.name == adhocName);
    if (found.length) {
      this.adhoc = found[0];
      this.subscription.status = 'Purchased';

      if (this.adhoc.scheduledTime) {
        if (+(new Date()) > +(new Date(this.adhoc.scheduledTime))) {

          if ((+(new Date()) + 86400000 ) > +(new Date(this.adhoc.scheduledTime))) {
            this.subscription.status = 'Missed'; 
          } else {
            this.subscription.status = 'Active'; 

          }
        } else {
          this.subscription.status = 'Scheduled';
        }
      }

      this.refreshStatus();
    }
  }



  sendReschedule() {
    this.scheduleService.emit(this.adhoc);
  }
}
