import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanService } from 'app/services/plan.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'checkout-details',
  templateUrl: './cehckout-details.component.html',
  styleUrls: ['./cehckout-details.component.scss'],
})
export class CheckoutDetailsComponent implements OnInit {

  @Input() plan: any;
  @Input() car: any;
  @Input() addon: any;
  @Input() adhoc: any;
  @Input() discount: any;
  @Input() includedAddons: any;
  @Input() includedAdhocs: any;
  @Input() mode: any;

  @Output() showAddonDetails = new EventEmitter();
  @Output() planChanged = new EventEmitter();
  @Output() removeAdhoc = new EventEmitter();
  @Output() removeAddon = new EventEmitter();
  @Output() removeCoupon = new EventEmitter();

  user: any;

  get productName() {
    let { mode, plan, addon, adhoc } = this;
    return mode.plan ? plan.name : (mode.adhoc ? adhoc.name : (mode.addon ? addon.name : 'Plan'))
  }

  get productLabel() {
    let { mode, plan, addon, adhoc } = this;
    return mode.plan ? 'Plan' : (mode.adhoc ? 'Service' : (mode.addon ? 'Addon' : 'Plan'))
  }

  get regNo() {
    let reg = this.car.regNo;

    let x = {
      pre: reg.substr(0, 4),
      mid: '',
      post: reg.substr(6, 4)
    }

    x.mid = reg.replace(x.pre, "").replace(x.post, '');

    return x;

  }

  get productPrice() {
    let { mode, plan, addon, adhoc } = this;
    return mode.plan ? plan.originalPrice || plan.price : (mode.adhoc ? adhoc.price : (mode.addon ? (addon.originalPrice || addon.price) : 'Plan'))
  }

  upgradeSelected: boolean;
  upgradePrice: any;

  lastPlan: any;

  upgradToPlan: string;
  originalPlan: any;

  addonPrice: any;
  adhocPrice: any;

  sendShowDetails(addon) {
    this.showAddonDetails.emit(addon);
  }


  constructor(
    private planService: PlanService,
    private userService: UserService
  ) {

    this.upgradeSelected = false;
    this.upgradToPlan = 'Elite';
    this.originalPlan = {};
    this.includedAddons = [];
    this.addonPrice = 0;
    this.mode = null;
    this.adhocPrice = 0;
    this.discount = {};

    this.user = userService.getCurrentUser();
  }

  calculateDiscount() {
    let total = this.getOrderPrice();
    let dscnt = 0;
    if (this.discount && this.discount.coupon) {
      let coupon = this.discount.coupon;
      if (coupon.unit == 'percent') {
        dscnt = Math.floor(total * (coupon.value / 100));
      } else {
        dscnt = coupon.value;
      }
      return dscnt;
    } else {
      return 0;
    }
  }

  onRemoveCoupon(cpn) {
    this.removeCoupon.emit(cpn);
  }

  ngOnChanges(changes) {

    if (this.discount.coupon) {
      this.discount.discount = this.calculateDiscount();
    }

    if (changes.includedAddons && this.includedAddons && this.includedAddons.length) {
      this.addonPrice = 0;
      this.includedAddons.forEach((adn) => {
        this.addonPrice += adn.originalPrice || adn.price;
      });
    }

    if (changes.includedAdhocs && this.includedAdhocs && this.includedAdhocs.length) {
      this.adhocPrice = 0;
      this.includedAdhocs.forEach((adn) => {
        this.adhocPrice += adn.price;
      });
    }
  }

  ngOnInit() {
    this.lastPlan = this.plan ? JSON.parse(JSON.stringify(this.plan)) : null;

    let coupon = this.planService.getAppliedCoupon();
    if (coupon) {
      this.discount = {
        discount: 0,
        coupon: coupon
      };
      this.discount.discount = this.calculateDiscount();
    }

    if (this.plan && this.lastPlan) {
      this.upgradePrice = this.planService.getUpdatePrice(this.plan.name);
    }

  }

  getServiceTotal() {
    let { mode } = this;
    let total = 0;

    if (mode) {
      if (mode.plan) {
        total += this.plan.originalPrice || this.plan.price;
      }
      if (mode.addon) {
        total += this.addonPrice;
      }
      if (mode.adhoc) {
        total += this.adhocPrice;
      }
      return total;
    } else {
      return total;
    }
  }

  getOrderPrice() {

    let total = this.getServiceTotal();

    if (this.user.referralBonusPending && this.user.referralBonusPending > 0) {
      total -= +(this.user.referralBonusPending);
    }

    return total;

  }

  getTotalPayable() {

    let total = this.getOrderPrice();
    if (this.discount && this.discount.discount) {
      total -= this.discount.discount;
    }

    return total;
  }

  toggleUpgrade(planName = null) {

    if (planName) {
      this.upgradToPlan = planName;
      this.upgradePrice = this.planService.getUpdatePrice(this.lastPlan.name, planName);
      //this.planService.changePlanForCar(this.upgradeSelected ? planName : this.lastPlan.name);
      //this.plan = this.planService.getSelectedPlan();
    } else {
      this.planService.changePlanForCar(this.upgradeSelected ? this.lastPlan.name : this.upgradToPlan);
      this.plan = this.planService.getSelectedPlan();
      this.planChanged.emit(this.plan);
      this.upgradeSelected = !this.upgradeSelected;
    }
  }

  sendRemoveAddon(addon) {
    this.removeAddon.emit(addon);
  }


  sendRemoveAdhoc(adhoc) {
    this.removeAdhoc.emit(adhoc);
  }


}
