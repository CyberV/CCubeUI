import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'plan-slider',
  templateUrl: './plan-slider.component.html',
  styleUrls: ['./plan-slider.component.scss'],
})
export class PlanSliderComponent implements OnInit {

  @Input() plans;
  @Input() bodyType;

  
  @Output() buyNow = new EventEmitter();
  @Output() showDetails = new EventEmitter();

  planList;
  colors;

  slideOpts:any;

  constructor() {

    this.plans = [];
    this.planList = [];
    this.bodyType = "sedan";

    this.colors = [
      '#ec6b1e',
      '#59EFE8',
      '#FFEB3B'
    ]
    
    this.slideOpts = {
      initialSlide: 0,
      centeredSlides: true,
    slidesPerView: 1.3,
    spaceBetween: 20,
      speed: 400,
      autoplay:true
    };
   }

  ngOnInit() {

    if (this.plans) {
      this.planList = this.plans.plans || this.plans;
    }

  }

  onBuy(payload) {
    this.buyNow.emit(payload);
  }

  onShowDetails(payload) {
    this.showDetails.emit(payload);
  }

}
