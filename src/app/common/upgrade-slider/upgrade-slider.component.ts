import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PurchasedPlanComponent } from '../purchased-plan/purchased-plan.component';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'upgrade-slider',
  templateUrl: './upgrade-slider.component.html',
  styleUrls: ['./upgrade-slider.component.scss'],
})
export class UpgradeSliderComponent implements OnInit {


  @Input() plans;

  
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
    //this.allFeatures = 

    this.colors = [
      '#59EFE8',
      '#FFEB3B',
      'yo'
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

    this.allFeatures = this.planService.AllFeatures;
  }

  ngOnChanges(changes) {

    if (changes.plans && this.plans) {
      this.planList = this.plans;
    } 
  }

  onBuy(payload) {
    this.upgradeNow.emit(payload);
  }

  onShowDetails(payload) {
    this.showDetails.emit(payload);
  }

}
