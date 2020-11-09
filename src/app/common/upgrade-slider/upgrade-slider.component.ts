import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PurchasedPlanComponent } from '../purchased-plan/purchased-plan.component';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'upgrade-slider',
  templateUrl: './upgrade-slider.component.html',
  styleUrls: ['./upgrade-slider.component.scss'],
})
export class UpgradeSliderComponent implements OnInit {

  plans;
  @Input() purchasedPlan;
  @Input() bodyType;

  
  @Output() upgradeNow = new EventEmitter();
  @Output() showDetails = new EventEmitter();

  planList;
  colors;

  allFeatures:any;
  slideOpts:any;
  upgradePrice:string;


  constructor(
    private planService:PlanService
  ) {

    this.plans = [];
    this.planList = [];
    this.bodyType = "sedan";
    this.purchasedPlan = {};
    this.allFeatures = 

    this.colors = [
      '#59EFE8',
      '#FFEB3B'
    ]
    
    this.slideOpts = {
      initialSlide: 0,
      centeredSlides: true,
    slidesPerView: 1.1,
    spaceBetween: 20,
      speed: 400
    };
   }

  ngOnInit() {

    this.plans = this.planService.getAllPlans();
    this.allFeatures = this.planService.AllFeatures;
    if (this.plans) {
      this.planList = this.plans;
      this.planList.pop();
    } 

  }

  ngOnChanges(changes) {

    if (changes.purchasedPlan) {
      
    }
  }

  onBuy(payload) {
    this.upgradeNow.emit(payload);
  }

  onShowDetails(payload) {
    this.showDetails.emit(payload);
  }

}
