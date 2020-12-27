import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanService } from 'app/services/plan.service';

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
  @Input() includedAddons: any;
  @Input() includedAdhocs: any;
  @Input() mode: any;
  
  @Output() showAddonDetails = new EventEmitter();
  @Output() removeAdhoc = new EventEmitter();
  @Output() removeAddon = new EventEmitter();

  get productName() {
    let {mode,plan,addon,adhoc} = this;
    return  mode.plan ? plan.name : (mode.adhoc ? adhoc.name : (mode.addon ? addon.name : 'Plan'))
  }

  get productLabel() {
    let {mode,plan,addon,adhoc} = this;
    return  mode.plan ? 'Plan' : (mode.adhoc ? 'Service' : (mode.addon ? 'Addon' : 'Plan'))
  }

  get productPrice() {
    let {mode,plan,addon,adhoc} = this;
    return  mode.plan ? plan.price : (mode.adhoc ? adhoc.price : (mode.addon ? addon.price : 'Plan'))
  }

  upgradeSelected: boolean;
  upgradePrice: any;

  lastPlan: any;

  upgradToPlan: string;
  originalPlan: any;

  addonPrice: any;
  adhocPrice: any;

  sendShowDetails(addon){
    this.showAddonDetails.emit(addon);
  }


  constructor(
    private planService: PlanService
  ) {

    this.upgradeSelected = false;
    this.upgradToPlan = 'Elite';
    this.originalPlan = {};
    this.includedAddons = [];
    this.addonPrice = 0;
    this.mode = null;
    this.adhocPrice = 0;
  }

  ngOnChanges(changes) {
    if (changes.includedAddons && this.includedAddons && this.includedAddons.length) {
      this.addonPrice = 0;
      this.includedAddons.forEach((adn) => {
        this.addonPrice += adn.price;
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
    if (this.plan && this.lastPlan) {
      this.upgradePrice = this.planService.getUpdatePrice(this.plan.name);
    }

  }

  getTotalPayable() {

    let {mode}= this;
    let total = 0;

    if (mode) {
      if (mode.plan) {
        total += this.plan.price;
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

  toggleUpgrade(planName = null) {

    if (planName) {
      this.upgradeSelected = true;
      this.upgradToPlan = planName;
      this.upgradePrice = this.planService.getUpdatePrice(this.lastPlan.name, planName);
      this.planService.changePlanForCar(this.upgradeSelected ? planName : this.lastPlan.name);
      this.plan = this.planService.getSelectedPlan();
    } else {
      this.planService.changePlanForCar(this.upgradeSelected ? this.lastPlan.name : this.upgradToPlan);
      this.plan = this.planService.getSelectedPlan();
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
