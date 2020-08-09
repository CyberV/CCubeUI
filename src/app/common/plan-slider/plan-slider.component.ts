import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'plan-slider',
  templateUrl: './plan-slider.component.html',
  styleUrls: ['./plan-slider.component.scss'],
})
export class PlanSliderComponent implements OnInit {

  @Input() plans;

  slideOpts:any;

  constructor() {

    this.plans = [];
    
    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };
   }

  ngOnInit() {}

}
