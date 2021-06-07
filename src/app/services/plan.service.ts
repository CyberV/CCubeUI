import { Injectable } from '@angular/core';
import { CarService } from './car.service';
import plansList from 'assets/planslist.json';
import { planData } from 'app/common/common.service';
import { getConfigValue } from 'app/common/common.service';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  AllPlans: any;

  AllFeatures: any;
  OnlyAddons: any;

  discountConfig:any;
  private _planSubject = new Subject();


  get UpgradePlan() {
    return JSON.parse(JSON.stringify(this.AllPlans.filter((plan) => plan.code.toLowerCase() == 'dlx')[0]));
  }

  createPeriodLabel(date, duration = "monthly") {
    if (date) {
      return date.toString().split(' ').slice(1, 2).join(' ') + " - " + new Date(+(date) + (2592000000 * (duration == 'quarterly' ? 3 : 1))).toString().split(' ').slice(1, 2).join(' ') + " " + new Date(+(date) + 2592000000).getFullYear();
    } else {
      return null;
    }
  }

  fixedAdhocs: any;

  ngOnInit() {

  }

  constructor(
    private carService: CarService,
    private toastController: ToastController
  ) {
    this.refreshPlans();
  }

  listner() {
    if (this._planSubject.closed) {
      this._planSubject = new Subject();
    }
    return this._planSubject;
  }

  refreshPlans() {
    this.discountConfig = getConfigValue("INBUILTDISCOUNT_CONFIG");
    this.AllPlans = this.getAllPlans();
    this.AllFeatures = this.getAllFeatures();

    this.fixedAdhocs = this.AllFeatures.filter((f) => f.isAdhoc == true && f.active);
    
    this.OnlyAddons = [];
    let map = this.AllFeatures.map((ftr) => ftr.code);
    for (let i = 0; i < this.AllFeatures.length; i++) {
      let remove = false;

      //remove = this.fixedAdhocs.some((adhoc) => adhoc.code.toLowerCase() == this.AllFeatures[i].code.toLowerCase());

      remove = this.AllFeatures[i].isAdhoc;

      if (!remove) {
        this.OnlyAddons.push(JSON.parse(JSON.stringify(this.AllFeatures[i])));
      }
    }

  }

  clearAll() {

    this.clear();
    this.clearAddons();
    this.clearAdhocs();
  }

  clearSubscription() {
    sessionStorage.setItem('currentSubscription', null);
  }

  clear() {
    sessionStorage.setItem('selectedPlan', null);
  }

  clearAddons() {
    sessionStorage.setItem('includedAddons', null);
  }

  clearAdhocs() {
    sessionStorage.setItem('includedAdhocs', null);
  }

  private generateComparisonPlan(currentPlan, targetPlan) {
    let features = JSON.parse(JSON.stringify(this.AllFeatures));
    let index = -1;
    currentPlan.features.forEach(featureCode => {
      index = targetPlan.features.indexOf(featureCode);
      if (index > -1) {
        targetPlan.features.splice(index, 1);
      }
    });

    targetPlan.price = this.getUpdatePrice(currentPlan.name, targetPlan.name);

    return targetPlan;

  }

  getUpgradePlans(payment) {
    let planName = payment.nextPlan && payment.nextPlan.plan ? payment.nextPlan.plan.name : payment.plan.name;
    let currentPlan = this.getPlanByName(planName);
    let targetPlan = this.UpgradePlan;

    switch (currentPlan.code) {
      case 'WFH':{
        return [
          this.generateComparisonPlan(currentPlan, this.getPlanByName('Standard')),
          this.generateComparisonPlan(currentPlan, this.getPlanByName('Deluxe'))
        ];

      }
      case 'STD': {
        return [
          this.generateComparisonPlan(currentPlan, this.getPlanByName('Deluxe'))
        ];

      }
      case 'DLX': {
        return [];
      }
      case 'ELT': {
        return [];
      }
      default: return [];
    }
  }

  getAllPlans() {
    let common = JSON.parse(localStorage.getItem('commonData'));
    if (common && common != "" && common != 'null') {
      let plans = common.plansList.plans;

      for (let i = 0; i < plans.length; i++) {
        plans[i] = this.updatePlanPricing(plans[i]);
      }
      return plans;


    } else {
      return [];
    }
  }

  getAllSubscriptions() {
    let common = JSON.parse(sessionStorage.getItem('currentPayments'));
    return common && common != "" && common != 'null' ? common : [];
  }

  forDemo() {
    let common = JSON.parse(sessionStorage.getItem('forDemo'));
    return common && common != "" && common != 'null' ? common : false;
  }

  getAllFeatures() {
    let common = JSON.parse(localStorage.getItem('commonData'));

    return common && common != "" && common != 'null' ? common.plansList.features : [];
  }

  getPlanByName(planName) {
    let found: any = this.AllPlans.filter((plan) => plan.name.toLowerCase() == planName.toLowerCase());

    return found.length ? found[0] : null;
  }

  // setDateFor(type, name, date) {
  //   switch(type) {
  //     case 'addon': {

  //       let found = this.getIncludedAddons().filter((adn) => adn.name == name);
  //       if (found && found.length) {
  //         found[0]
  //       }
  //       break;
  //     }
  //     case 'adhoc': {
  //       break;
  //     }
  //     default: break;
  //   }
  // }



  //planName : string => current plan name
  //upgradeToPlan : string => planName of upgradePlan
  getUpdatePrice(planName, upgradeToPlan = null) {
    let currentPlan;

    if (upgradeToPlan == 'Work From Home') {
      return 0;
    }

    let car = this.carService.getCurrentCar();
    let upgradePlan = upgradeToPlan ? this.getPlanByName(upgradeToPlan) || this.UpgradePlan : this.UpgradePlan;

    let found: any = this.AllPlans.filter((plan) => plan.name.toLowerCase() == planName.toLowerCase());

    if (found && found.length) {
      currentPlan = found[0];

      if (car) {
        currentPlan.price = +currentPlan.pricing[car.bodyType];
        let upgradePrice = +upgradePlan.pricing[car.bodyType];

        if (upgradePrice && currentPlan.price) {
          return upgradePrice - currentPlan.price;
        }
      }
    }

    return 0;

  }

  changePlanForCar(planName, car = null) {

    let plan = this.getSelectedPlan();

    if (!car) {
      car = this.carService.getCurrentCar();
    }

    if (!planName) {
      return;
    }

    let found: any = this.AllPlans.filter((plan) => plan.name.toLowerCase() == planName.toLowerCase());

    if (found && found.length) {

      found = this.updatePlanPricing(found[0]);


      if (plan && plan.forRenew) {
        found.forRenew = true;
        found.lastDate = plan.lastDate;
        found.period = plan.period;
      }

      this.changePlan(found);
    }
  }

  isSecondCar() {
    let car = this.carService.getCurrentCar();
    let subs = this.getAllSubscriptions().filter((s)=> !s.isAdhoc);
    return subs.length > 0 && car && car.regNo !=  subs[0].carRegNo;
  }

  private updatePlanPricing(plan) {
    let car = this.carService.getCurrentCar();
    let bodyType = 'sedan';
    let subs = this.getAllSubscriptions();
    let sub = car ? subs.filter((s) => s.carRegNo == car.regNo) : null;
    if (car) {
      bodyType = car.bodyType;
    }
    plan.price = +(plan.pricing[bodyType]);
    plan.carNumber = sub && sub.length ? subs.indexOf(sub[0]) + 1 : subs.length + 1;

    if (this.isSecondCar()) {
      if (this.discountConfig && this.discountConfig.plan && this.discountConfig.plan.secondCar) {
        plan.originalPrice = plan.price;
       
        plan.forSecondCar = true;
        plan.price -= this.discountConfig.plan.secondCar;
      } else {
        plan.originalPrice = null;
        plan.forSecondCar = null;
      }
    } else {
      plan.originalPrice = null;
      plan.forSecondCar = null;
    }

    let duration = this.getPlanDuration();

    plan.duration = duration;
    plan.period = this.createPeriodLabel(plan.lastDate ? new Date(plan.lastDate) : new Date(), plan.duration);

    if (duration == "quarterly") {

      plan.price = (plan.originalPrice || plan.price) * 3;

      let dscnt: number = (getConfigValue('DISCOUNT_QUARTERLY'));

      if (dscnt && dscnt > 0) {
        plan.originalPrice = plan.price;
        let discount = Math.floor((plan.price * dscnt) / 100);
        plan.price = plan.originalPrice - discount;
      }

      return plan;
    } else {
      plan.originalPrice = plan.originalPrice ? plan.originalPrice : null;
    }
    return plan;
  }

  getPlanDuration() {
    let subs = sessionStorage.getItem('planDuration');
    return subs && subs != "null" ? subs : 'monthly';
  }

  updatePlanDuration(duration) {
    let plan = this.getSelectedPlan();
    if (plan) {
      sessionStorage.setItem('planDuration', duration);
      let updatedPlan = this.updatePlanPricing(plan);
      this.changePlan(updatedPlan);
    }
    else {
      sessionStorage.setItem('planDuration', duration);
    }

    this._planSubject.next({
      key: 'planDuration',
      value: duration
    });

    let addons = this.getIncludedAddons();

    if (addons && addons.length) {
      let data = [];
      plan = this.getSelectedPlan();
      for (let i = 0; i < addons.length; i++) {
        let addon = addons[i];
        addon.duration = duration;
        addon.period = plan.period;

        addon.price = addon.pricing[this.carService.getCurrentCar().bodyType];

        if (plan && this.discountConfig && this.discountConfig.addon && this.discountConfig.addon.withPlan) {
          addon.originalPrice = addon.price;
          addon.withPlan = true;
          addon.price -= this.discountConfig.addon.withPlan;
        } else {
          addon.originalPrice = null;
          addon.withPlan = false;
        }        

        if (duration == "quarterly") {
          addon.price = addon.price * 3;

          // let dscnt: number = (getConfigValue('DISCOUNT_QUARTERLY'));

          // if (dscnt && dscnt > 0) {
          //   addon.originalPrice = addon.price;
          //   let discount = Math.floor((addon.price * dscnt) / 100);
          //   addon.price = addon.originalPrice - discount;
          // } else {
          //   addon.originalPrice = addon.originalPrice ? addon.originalPrice : null;
          // }

        } else {
          addon.originalPrice = addon.originalPrice ? addon.originalPrice : null;          
        }
        data.push(addon);
      }

      sessionStorage.setItem('includedAddons', JSON.stringify(data));
    }
  }

  renewPlan(plan, lastDate) {

    plan.forRenew = true;
    plan.lastDate = lastDate;

    plan.period = this.createPeriodLabel(plan.lastDate);

    this.changePlan(plan);

  }

  changePlan(plan) {
    if (plan) {
      sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    }

  }

  async lockCurrentOrder(order) {
    return new Promise((resolve) => {


      let total = 0;
      let info: any = {};

      if (order.plan) {
        total += order.plan.originalPrice || order.plan.price;
      }

      if (order.addons && order.addons.length) {
        info.addons = "";
        order.addons.forEach((adn) => {
          total += adn.originalPrice || adn.price;
          info.addons += adn.name + ", "
        });
        info.addons = info.addons.substr(0, info.addons.length - 2);
      }

      if (order.adhocs) {
        info.adhocs = "";
        order.adhocs.forEach((adh) => {
          total += adh.price;
          info.adhocs += adh.name + ", "
        });
        info.adhocs = info.adhocs.substr(0, info.adhocs.length - 2);
      }

      if (order.bonus && order.bonus > 0) {

        order.bonus = order.bonus > order.serviceTotal ? order.serviceTotal : order.bonus;
        total -= order.bonus;
        info.bonus = order.bonus;
      }

      if (order.discount && order.discount.discount > 0) {
        total -= order.discount.discount;
        info.discount = order.discount;
      }

      if (order.newCarDiscount > 0) {
        total -= order.newCarDiscount;
        info.newCarDiscount = order.newCarDiscount;
      }

      order.total = total >= 0 ? total: 0;
      order.info = info;


      sessionStorage.setItem('currentOrder', JSON.stringify(order));

      resolve(order);
    })
  }

  getCurrentSubscription() {
    let subs = sessionStorage.getItem('currentSubscription');
    return subs && subs != "null" ? JSON.parse(subs) : null;
  }

  setCurrentSubscription(subscription) {
    if (subscription) {
      sessionStorage.setItem('currentSubscription', JSON.stringify(subscription));
    }
  }

  changeDateForAdhoc(adhoc) {
    let adhocs = this.getIncludedAdhocs();

    let found = adhocs.filter((a) => a.code == adhoc.code);
    
    if (found.length) {
      found = adhocs.indexOf(found[0]);
      adhocs[found].scheduledDate = adhoc.scheduledDate;
      this.setIncludedAdhocs(adhocs);
    }
  }


  getFeaturesForPlan(planName) {
    let found = this.AllPlans.filter((pln) => pln.name == planName);

    if (found && found.length) {
      found = found[0];
      let ff = this.AllFeatures.filter((ftr) => found.features.some((fftr) => fftr == ftr.code));
      return ff;
    }
  }


  getUniqueFeaturesForPlan(planName, ignoreAdhocs = false) {
    let found = this.AllPlans.filter((pln) => pln.name == planName);

    let src = ignoreAdhocs ? this.OnlyAddons : this.AllFeatures;

    if (found && found.length) {
      found = found[0];
      let ff = src.filter((ftr) => found.uniqueFeatures.some((fftr) => {

        let allowed = fftr == ftr.code;

        return allowed;

      }
      ));
      return ff;
    }
  }
  getAdhocsForPlan(planName) {
    return this.fixedAdhocs;
    // let addons = [];



    // switch (planName) {
    //   case 'Standard': {
    //     Array.prototype.push.apply(addons, this.getUniqueFeaturesForPlan('Deluxe', true));
    //     Array.prototype.push.apply(addons, this.getUniqueFeaturesForPlan('Elite', true));
    //     break;
    //   }
    //   case 'Deluxe': {

    //     Array.prototype.push.apply(addons, this.getUniqueFeaturesForPlan('Elite', true));

    //     break;
    //   }
    //   default: return addons;
    // }

    // return addons;
  }


  getAddonsForPlan(planName) {
     
    let addons = [];

    // this.fixedAdhocs.forEach((adhocCode) => {
    //   let found = this.AllFeatures.filter((ftr) => ftr.code == adhocCode);

    //   if (found && found.length) {
    //     addons.push(JSON.parse(JSON.stringify(found[0])));
    //   }

    // })

    switch (planName) {
      case 'Work From Home':
      case 'Standard': {
        Array.prototype.push.apply(addons, this.getUniqueFeaturesForPlan('Deluxe', true));
        //Array.prototype.push.apply(addons, this.getUniqueFeaturesForPlan('Elite', true));
        break;
      }
      // case 'Deluxe': {

      //   Array.prototype.push.apply(addons, this.getUniqueFeaturesForPlan('Elite', true));

      //   break;
      // } 
      default: return addons;
    }

    return addons;
  }

  getCurrentOrder() {
    let order = sessionStorage.getItem('currentOrder');
    return order && order != "null" ? JSON.parse(order) : null;
  }

  getSelectedPlan() {
    let plan = sessionStorage.getItem('selectedPlan');
    return plan && plan != "null" ? JSON.parse(plan) : null;
  }

  getIncludedAddons() {
    let addons = sessionStorage.getItem('includedAddons');
    return addons && addons != "null" ? JSON.parse(addons) : [];
  }

  excludeAddon(addon, showToast=false) {
    let addons = this.getIncludedAddons();
    if (!addons) {
      return;
    }

    if (addons.length == 1 && addons[0].name == addon.name) {
      addons = [];
    } else {
      addons.splice(addons.indexOf(addons.filter((a) => a.name == addon.name)[0]), 1);
    }

    showToast ? this.presentToast(addon.name + " Removed!") : '';

    sessionStorage.setItem('includedAddons', JSON.stringify(addons));

    return addons;
  }

  includeAddonWithCode(addonCode) {
    let found = this.getAllFeatures().filter((f) => f.code.toLowerCase() == addonCode.toLowerCase());

    let car = this.carService.getCurrentCar();

    if (found.length && car) {
      found = found[0];

      found.price = found.pricing[car.bodyType];
      this.includeAddon(found);
    }
  }

  includeAddon(addon, showToast = false) {
    let addons = this.getIncludedAddons();
    if (!addons) {
      addons = [];
    }

    if (addons.some((a) => a.name == addon.name)) {
    } else {

      addon.duration = this.getPlanDuration();

      if (addon.duration == 'quarterly') {
        addon.price = addon.price * 3;
      }

      addons.push(addon);
      sessionStorage.setItem('includedAddons', JSON.stringify(addons));
      showToast ? this.presentToast(addon.name + " Added!") : '';
    }

    return addons;
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  getIncludedAdhocs() {
    let adhocs = sessionStorage.getItem('includedAdhocs');
    return adhocs && adhocs != "null" ? JSON.parse(adhocs) : [];
  }

  setIncludedAddons(d) {
    sessionStorage.setItem('includedAddons', JSON.stringify(d));
  }

  setIncludedAdhocs(d) {
    sessionStorage.setItem('includedAdhocs', JSON.stringify(d));
  }

  getAppliedCoupon() {
    let adhocs = sessionStorage.getItem('appliedCoupon');
    return adhocs && adhocs != "null" ? JSON.parse(adhocs) : null;
  }

  setAppliedCoupon(d) {
    sessionStorage.setItem('appliedCoupon', d ? JSON.stringify(d) : null);
  }

  refreshAdhocs() {
    let adhocs = this.getIncludedAdhocs();
    let car = this.carService.getCurrentCar();

    if (adhocs.length && car) {
      for (let i = 0; i < adhocs.length; i++) {
        adhocs[i].price = adhocs[i].pricing[car.bodyType];
      }

      sessionStorage.setItem('includedAdhocs', JSON.stringify(adhocs));

    }
  }

  excludeAdhoc(adhoc, showToast = false) {
    let adhocs = this.getIncludedAdhocs();
    if (!adhocs) {
      return;
    }

    if (adhocs.length == 1 && adhocs[0].name == adhoc.name) {
      adhocs = [];
    } else {
      adhocs.splice(adhocs.indexOf(adhocs.filter((a) => a.name == adhoc.name)[0]), 1);
    }

    sessionStorage.setItem('includedAdhocs', JSON.stringify(adhocs));
    showToast ? this.presentToast(adhoc.name + " Removed!") : '';

    return adhocs;
  }

  includeAdhoc(adhoc, showToast = false) {
    let adhocs = this.getIncludedAdhocs();
    if (!adhocs) {
      adhocs = [];
    }

    if (adhocs.some((a) => a.name == adhoc.name)) {
    } else {
      adhocs.push(adhoc);

      
      showToast ?this.presentToast(adhoc.name + " Added!") : '';

      sessionStorage.setItem('includedAdhocs', JSON.stringify(adhocs));
    }

    return adhocs;
  }
}
