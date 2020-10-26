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


  constructor(
    private planService:PlanService
  ) {
    this.upgradeSelected = false;
   }

  ngOnInit() {
    this.lastPlan = this.plan ? JSON.parse(JSON.stringify(this.plan)) : null;
    this.upgradePrice = this.planService.getUpdatePrice(this.plan.name);
  }

  toggleUpgrade() {
    this.planService.changePlanForCar( this.upgradeSelected ? this.lastPlan.name : 'Elite');
    this.plan = this.planService.getSelectedPlan();
    this.upgradeSelected  = !this.upgradeSelected;
    
  }

}
