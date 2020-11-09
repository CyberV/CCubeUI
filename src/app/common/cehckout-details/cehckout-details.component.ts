import { Component, OnInit, Input } from '@angular/core';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'checkout-details',
  templateUrl: './cehckout-details.component.html',
  styleUrls: ['./cehckout-details.component.scss'],
})
export class CheckoutDetailsComponent implements OnInit {

  @Input() plan:any;
  @Input() car:any;

  upgradeSelected:boolean;
  upgradePrice:any;

  lastPlan:any;

  upgradToPlan:string;
  originalPlan:any;


  constructor(
    private planService:PlanService
  ) {

    this.upgradeSelected = false;
    this.upgradToPlan = 'Elite';
    this.originalPlan = {};
   }

  ngOnInit() {
    this.lastPlan = this.plan ? JSON.parse(JSON.stringify(this.plan)) : null;
    this.upgradePrice = this.planService.getUpdatePrice(this.plan.name);
  }

  toggleUpgrade(planName = null) {

    if (planName) {
      this.upgradeSelected = true;
      this.upgradToPlan = planName;
      this.upgradePrice = this.planService.getUpdatePrice(this.lastPlan.name, planName);
      this.planService.changePlanForCar( this.upgradeSelected ? planName : this.lastPlan.name );
      this.plan = this.planService.getSelectedPlan();
    } else {
      this.planService.changePlanForCar( this.upgradeSelected ? this.lastPlan.name : this.upgradToPlan);
      this.plan = this.planService.getSelectedPlan();
      this.upgradeSelected  = !this.upgradeSelected;
    }


    
  }

}
