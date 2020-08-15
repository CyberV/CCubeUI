import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'plan-slider',
  templateUrl: './plan-slider.component.html',
  styleUrls: ['./plan-slider.component.scss'],
})
export class PlanSliderComponent implements OnInit {

  @Input() plans;
  @Input() bodyType;

  planList;

  slideOpts:any;

  constructor() {

    this.plans = [];
    this.planList = [];
    this.bodyType = "sedan";
    
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    };
   }

  ngOnInit() {

    if (this.plans) {
      this.planList = this.plans.plans;
    }

  }

}
