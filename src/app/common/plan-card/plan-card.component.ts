import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent implements OnInit {

  @Input() plan: any;
  @Input() features: any;
  @Input() bodyType: string;
  @Input() color:string;

  @Output() buyNow = new EventEmitter();
  @Output() showDetails = new EventEmitter();

  currentFeatures: any;
  missingFeatures: any;
  colors: any;

  constructor() {
    this.plan = {
      name: 'Standard',
      price: 500
    }
    this.currentFeatures = [];
    this.missingFeatures = [];

    this.bodyType="";
    this.color = "inherit";

    
    this.colors = [
      '#ec6b1e',
      '#009688',
      '#FFEB3B'
    ]
   }

  ngOnInit() {

    if (this.plan && this.features && this.bodyType) {
        this.missingFeatures = JSON.parse(JSON.stringify(this.features));
        this.plan.features.forEach(feature => {
          this.currentFeatures.push(this.features.filter( (ftr) => ftr.code === feature)[0]);
          let last = this.currentFeatures[this.currentFeatures.length - 1];
          this.missingFeatures = this.missingFeatures.filter ( (ftr) => ftr.code !== last.code);
        });
        this.plan.price = this.plan.pricing[this.bodyType];

        
    }

  }

  onBuy() {
    let payload = {
      plan: this.plan,
      bodyType: this.bodyType
    }
    this.buyNow.emit(payload);
  }

  onShowDetails() {
    let payload = {
      plan: this.plan,
      bodyType: this.bodyType,
      features: this.features
    }
    this.showDetails.emit(payload);
  }

}
