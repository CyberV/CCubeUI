import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';
import { AccordionComponent } from '../accordion/accordion.component';
import { BookDemoComponent } from '../book-demo/book-demo.component';

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

  @Output() discount = new EventEmitter();
  @Output() showAddons = new EventEmitter();

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
    private planService: PlanService
  ) {
    this.totalAmount = 100;
    this.slim = false;
    this.appliedCoupons = [];
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

  applyCoupon(coupon) {
    this.loading[coupon.code] = true;
    this.loginService.tryCoupon(this.totalAmount, coupon).subscribe((response:any) => {
      this.loading[coupon.code]= false;
      if (response.success) {
        this.planService.setAppliedCoupon(coupon);
        this.appliedCoupons = [coupon];
          this.discount.emit({
            discount: response.data.discount,
            coupon: coupon
          });

          this.couponAccordion.first.toggle();
      }
    })
  }

  sendToAddons() {

    this.showAddons.emit();
    event.preventDefault();
    event.stopPropagation();
  }

  ngOnInit() {
    let coupon = this.planService.getAppliedCoupon();

    if (coupon) {
      this.appliedCoupons = [coupon];

    }
  }

}
