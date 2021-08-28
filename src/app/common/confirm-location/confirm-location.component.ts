import { Component, OnInit, Output, EventEmitter, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { SelectSocietyComponent } from '../select-society/select-society.component';
import { PlanService } from 'app/services/plan.service';
import { AlertController } from '@ionic/angular';
import { HeaderService } from 'app/header.service';
@Component({
  selector: 'confirm-location',
  templateUrl: './confirm-location.component.html',
  styleUrls: ['./confirm-location.component.scss'],
})
export class ConfirmLocationComponent implements OnInit {



  @Input() location: any;

  @Input() forDemo:boolean;
  @Output() retryCoupons = new EventEmitter();

  isUnlisted: boolean;
  disableAll: boolean;
  allInputs: any;

  get allFieldsReady() {
    let loc = this.location.location || this.location;
    let ready = loc.houseNo.length > 0 && loc.city.length > 0 && loc.state.length > 0 && ((loc.society && loc.society.length > 0) || (loc.location && loc.location.society.length > 0));
    return ready;
  }

  @Output() confirm = new EventEmitter();

  societyData: any;

  @ViewChildren('inpStreet') inpStreet: QueryList<HTMLElement>;
  @ViewChild('inpSociety') inpSociety: SelectSocietyComponent;
  @ViewChildren('inpCity') inpCity: QueryList<HTMLElement>;
  @ViewChildren('ctaConfirm') ctaConfirm: QueryList<HTMLElement>;

  constructor(
    private userService: UserService,
    private planService: PlanService,
    private alertController: AlertController,
    private headerService: HeaderService
  ) {
    this.disableAll = false;
    this.location = {
      houseNo: '',
      block: '',
      society: '',
      city: '',
      state: ''
    };
    this.forDemo = false; 
    this.isUnlisted = false;

  }


  focusTo(emt) {

    this.allInputs = {
      inpStreet: this.inpStreet.first,
      inpCity: this.inpCity.first,
      inpSociety: (this.inpSociety) as any,
      ctaConfirm: this.ctaConfirm.first,
    }

    let e = this.allInputs[emt];

    if (e) {
      e.focus();
    }
  }

  sendRetryCoupon() {
    let payload = {
      isUnlisted: this.isUnlisted,
      society: this.location.society
    };
    localStorage.setItem('selectedSociety', JSON.stringify(payload));
    this.retryCoupons.emit();
  }

  handleSocietyChange(data) {
    console.log('Confirm location', data);
    this.isUnlisted = data.isUnlisted;
     ;
    this.location.society = data.society;

    let cpn = this.planService.getAppliedCoupon();
    this.checkValues();
    if (this.societyData.society != this.location.society && cpn && cpn.validFor == "society") {
      this.showCouponAlert();
      let payload = {
        isUnlisted: this.isUnlisted,
        society: this.location.society
      };
      localStorage.setItem('selectedSociety', JSON.stringify(payload));
    }
  }

  async showCouponAlert() {
    let alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '',
      subHeader: 'Cooupon Removed',
      message: 'The selected coupon has been removed. You can check for available coupons for your selected society.',
      buttons: ['OK']
    });


    await alert.present();

    this.planService.removeCouponFromOrder();


    alert.onWillDismiss().then(() => {
      // if (data.action && data.action == 'refresh') {
      //   window.location.reload();
      // }
      alert.cssClass = 'animate__animated  animate__fadeOut';
      let order = this.planService.getCurrentOrder();
      if (order) {
        this.headerService.setView('checkout', { amount: order.total });
      }

      //window.location.reload();

      // setTimeout(()=>{
      //   this.notificationService.markNotificationAsRead(data);
      // }, 1000);
    });
  }

  sendConfirmation() {
    this.confirm.emit({
      location: this.location,
      isUnlisted: this.isUnlisted
    });
  }

  checkValues() {
    console.log('From Check values', this.location);
    if (this.allFieldsReady) {

    } else {
      this.confirm.emit(null);
    }
  }

  ngOnInit() {
    let user = this.userService.getCurrentUser();
    let city = user && user.city;
    if (city) {
      this.location.city = city;
    }

    let subs = this.planService.getAllSubscriptions();

    if (this.location.houseNo && this.location.houseNo.length && subs.length) {
      this.disableAll = true;
      this.sendConfirmation();
    }

    let soc = localStorage.getItem('selectedSociety');

    this.societyData = soc && soc != "null" ? JSON.parse(soc) : null;

    if (this.societyData) {
      this.isUnlisted = this.societyData.isUnlisted;
       ;
      this.location.society = this.societyData.society;

      if (this.isUnlisted) {
        this.inpSociety.showUnlisted(this.societyData.society);
        //this.location.society = 'Other';
      }
    }

  }



}
