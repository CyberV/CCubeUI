import { Injectable } from '@angular/core';
import { CarService } from './car.service';
import plansList from 'assets/planslist.json';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  public AllPlans = plansList.plans;
  public AllFeatures = plansList.features;

  private UpgradePlan = this.AllPlans.filter( (plan) => plan.name.toLowerCase() == 'elite')[0];


  constructor(
    private carService:CarService
  ) { }

  clear() {
    sessionStorage.setItem('selectedPlan', null);
  }

  getSelectedPlan() {
    let plan = sessionStorage.getItem('selectedPlan');
    return plan && plan != "null" ? JSON.parse(plan) : null;
  }

  getUpdatePrice(planName) {
    let currentPlan;

    let car = this.carService.getCurrentCar();

    let found :any = this.AllPlans.filter( (plan) => plan.name.toLowerCase() == planName.toLowerCase());

    if (found && found.length) {
      currentPlan = found[0];

      if (car) {
        currentPlan.price = +currentPlan.pricing[car.bodyType];
        let upgradePrice = +this.UpgradePlan.pricing[car.bodyType];

        if (upgradePrice && currentPlan.price) {
          return upgradePrice - currentPlan.price;
        }
      }
    }

    return 0;

  }

  changePlanForCar(planName, car=null) {

    let plan = this.getSelectedPlan();

    if (!car) {
      car = this.carService.getCurrentCar();
    }

    if(!planName) {
      return;
    }

    let found :any = this.AllPlans.filter( (plan) => plan.name.toLowerCase() == planName.toLowerCase());

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
  
    plan.period = lastDate.toString().split(' ').slice(1,2).join(' ') + " - " + new Date(+(lastDate) + 2592000000).toString().split(' ').slice(1,2).join(' ') +" " + new Date(+(lastDate) + 2592000000).getFullYear();

    this.changePlan(plan);

  }

  changePlan(plan) {
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
}
}
