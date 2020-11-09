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


  constructor(
    private carService: CarService
  ) { }

  clear() {
    sessionStorage.setItem('selectedPlan', null);
  }

  private generateComparisonPlan(currentPlan, targetPlan) {
    let features = JSON.parse(JSON.stringify(this.AllFeatures));
    let index=-1;
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

  getSelectedPlan() {
    let plan = sessionStorage.getItem('selectedPlan');
    return plan && plan != "null" ? JSON.parse(plan) : null;
  }

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

    plan.period = lastDate.toString().split(' ').slice(1, 2).join(' ') + " - " + new Date(+(lastDate) + 2592000000).toString().split(' ').slice(1, 2).join(' ') + " " + new Date(+(lastDate) + 2592000000).getFullYear();

    this.changePlan(plan);

  }

  changePlan(plan) {
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
  }
}
