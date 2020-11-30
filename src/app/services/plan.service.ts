import { Injectable } from '@angular/core';
import { CarService } from './car.service';
import plansList from 'assets/planslist.json';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  public get AllPlans() {
    return JSON.parse(JSON.stringify(plansList.plans));
  }

  public get AllFeatures() {
    return JSON.parse(JSON.stringify(plansList.features));
  }

  get UpgradePlan() {
    return JSON.parse(JSON.stringify(this.AllPlans.filter((plan) => plan.name.toLowerCase() == 'elite')[0]));
  }

  createPeriodLabel(date) {
    if (date) {
      return date.toString().split(' ').slice(1, 2).join(' ') + " - " + new Date(+(date) + 2592000000).toString().split(' ').slice(1, 2).join(' ') + " " + new Date(+(date) + 2592000000).getFullYear();
    } else {
      return null;
    }
  }


  constructor(
    private carService: CarService
  ) { }

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

  getUpgradePlans(planName) {
    let currentPlan = this.getPlanByName(planName);
    let targetPlan = this.UpgradePlan;

    switch (currentPlan.name) {
      case 'Standard': {
        return [
          this.generateComparisonPlan(currentPlan, targetPlan),
          this.generateComparisonPlan(currentPlan, this.getPlanByName('Deluxe'))
        ];

      }
      case 'Deluxe': {
        return [this.generateComparisonPlan(currentPlan, targetPlan)];
      }
      case 'Elite': {
        return [];
      }
      default: return [];
    }
  }

  getAllPlans() {
    return JSON.parse(JSON.stringify(this.AllPlans));
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

      found[0].price = found[0].pricing[car.bodyType];

      if (plan && plan.forRenew) {
        found[0].forRenew = true;
        found[0].lastDate = plan.lastDate;
        found[0].period = plan.period;
      }

      this.changePlan(found[0]);
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

  lockCurrentOrder(order) {
    let total = 0;
    let info: any = {};

    if (order.plan) {
      total += order.plan.price;
    }

    if (order.addons && order.addons.length) {
      info.addons = "";
      order.addons.forEach((adn) => {
        total += adn.price;
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

    order.total = total;
    order.info = info;


    sessionStorage.setItem('currentOrder', JSON.stringify(order));

    return order;
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

  getAddonsForPlan(planName) {
    switch(planName) {
      case 'Standard': {
        return this.AllFeatures.filter((ftr) => ftr.weight > 1 && !ftr.isAdhoc);
      }
      case 'Deluxe': {
        return this.AllFeatures.filter((ftr) => ftr.weight > 2);
      }
      default: return [];
    }
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

  excludeAddon(addon) {
    let addons = this.getIncludedAddons();
    if (!addons) {
      return;
    }

    if (addons.length == 1 && addons[0].name == addon.name) {
      addons = [];
    } else {
      addons.splice(addons.indexOf(addons.filter((a) => a.name == addon.name)[0]), 1);
    }


    sessionStorage.setItem('includedAddons', JSON.stringify(addons));

    return addons;
  }

  includeAddon(addon) {
    let addons = this.getIncludedAddons();
    if (!addons) {
      addons = [];
    }

    if (addons.some((a) => a.name == addon.name)) {
    } else {
      addons.push(addon);
      sessionStorage.setItem('includedAddons', JSON.stringify(addons));
    }

    return addons;
  }

  getIncludedAdhocs() {
    let adhocs = sessionStorage.getItem('includedAdhocs');
    return adhocs && adhocs != "null" ? JSON.parse(adhocs) : [];
  }

  excludeAdhoc(adhoc) {
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

    return adhocs;
  }

  includeAdhoc(adhoc) {
    let adhocs = this.getIncludedAdhocs();
    if (!adhocs) {
      adhocs = [];
    }

    if (adhocs.some((a) => a.name == adhoc.name)) {
    } else {
      adhocs.push(adhoc);
      sessionStorage.setItem('includedAdhocs', JSON.stringify(adhocs));
    }

    return adhocs;
  }
}
