import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';
import { AccordionComponent } from '../accordion/accordion.component';
import { BookDemoComponent } from '../book-demo/book-demo.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss'],
})
export class CouponsListComponent implements OnInit {

  @Input() availableCoupons:any;
  @Input() totalAmount:number;
  @Input() slim:boolean;

  @Input() appliedCoupons:any;
  loading: any;
  customCoupon:string;

  @Output() discount = new EventEmitter();
  @Output() showAddons = new EventEmitter();
  @Output() removeCoupon = new EventEmitter();

  @ViewChildren('couponAccordion') couponAccordion : QueryList<AccordionComponent>;

  isCouponEligible(coupon) {
    return this.totalAmount >= coupon.minCartValue;
  }


  get filteredCoupons() {
    if (this.appliedCoupons && this.appliedCoupons.length) {
      let selected = this.appliedCoupons[0];
      return this.availableCoupons.filter((cpn) => cpn.code != selected.code);
    } else {
      return this.availableCoupons;
    }
    
  }

  constructor(
    private loginService: LoginService,
    private planService: PlanService,
    private toastController: ToastController
  ) {
    this.totalAmount = 100;
    this.slim = false;
    this.appliedCoupons = [];
    this.customCoupon = '';
    this.availableCoupons = [
      {
        name: 'CCUBE-USER-1',
        description: 'Coupon for Specific Customers',
        unit: 'value',
        value: 100,
        validFor: 'user',
        code: 'USER-1'
      },{
      name: 'CCUBE-SOCIETY-1',
      description: 'Coupon for Society',
      unit: 'percent',
      value: 10,
      validFor: 'society',
      society: 'Selected Society',
      code: 'SOC-1'
    },{
      name: 'CCUBE-ALL-1',
      description: 'Coupon for All Customers',
      unit: 'percent',
      value: 20,
      validFor: 'all',
      code: 'ALL-1'
    },
    {
      name: 'CCUBE-ALL-2',
      description: 'Coupon for All Customers',
      unit: 'percent',
      value: 10,
      validFor: 'all',
      code: 'ALL-2'
    }];
    this.loading = {};
  }

  ngOnChanges(changes) {
    if(changes.totalAmount && this.totalAmount) {
      this.applyCoupon(this.appliedCoupons.length ? this.appliedCoupons[0] : null);
    }

  }

  openCoupons() {
    if (!this.couponAccordion.first.isOpen)
    this.couponAccordion.first.toggle();
  }

  tryCoupon(couponCode) {
    if (!couponCode) {
      return;
    }
    this.loading[couponCode] = true;
    this.loginService.tryCoupon(this.totalAmount, couponCode).subscribe(async (response:any) => {
      this.loading[couponCode]= false;
      if (response.success) {
        this.customCoupon = "";
        this.planService.setAppliedCoupon(response.data.coupon);
        this.appliedCoupons = [response.data.coupon];
        this.discount.emit(response.data);

          if (this.couponAccordion.first.isOpen)
          this.couponAccordion.first.toggle();
      } else {
        this.presentToast(response.error);
        //this.planService.setAppliedCoupon(null);
        //this.appliedCoupons = [];
        // this.discount.emit({
        //   discount: 0,
        //   coupon: null
        // });
      }
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  async applyCoupon(coupon) {
    if (!coupon) {
      return;
    }
    this.loading[coupon.code] = true;
    this.loginService.tryCoupon(this.totalAmount, coupon.code).subscribe(async (response:any) => {
      this.loading[coupon.code]= false;
      if (response.success) {
        this.planService.setAppliedCoupon(coupon);
        this.appliedCoupons = [coupon];
        this.discount.emit(response.data);

          if (this.couponAccordion.first.isOpen)
          this.couponAccordion.first.toggle();
      } else {
        this.planService.setAppliedCoupon(null);
        this.appliedCoupons = [];
        this.discount.emit({
          discount: 0,
          coupon: null
        });
      }
    })
  }

  onRemoveCoupon() {
    this.removeCoupon.emit();
  }

  sendToAddons() {

    this.showAddons.emit();
    event.preventDefault();
    event.stopPropagation();
  }

  societyData:any;

  ngOnInit() {
    let coupon = this.planService.getAppliedCoupon();

    let soc = localStorage.getItem('selectedSociety');

    this.societyData = soc && soc != "null" ? JSON.parse(soc) : null;

    if (coupon) {
      this.appliedCoupons = [coupon];

    }
  }

}
