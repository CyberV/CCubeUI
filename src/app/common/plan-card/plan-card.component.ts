import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanService } from 'app/services/plan.service';

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

  @Input() forUpgrade:boolean;
  @Input() purchasedPlan:any;

  @Output() buyNow = new EventEmitter();
  @Output() showDetails = new EventEmitter();

  currentFeatures: any;
  missingFeatures: any;
  upgradePrice:any;
  colors: any;

  constructor(
    private planService:PlanService
  ) {
    this.plan = {
      name: 'Standard',
      price: 500
    }
    this.currentFeatures = [];
    this.missingFeatures = [];
    this.forUpgrade = false;
    this.purchasedPlan = {};

    this.bodyType="";
    this.color = "inherit";

    
    this.colors = [
      '#ec6b1e',
      '#59EFE8',
      '#FFEB3B'
    ]
   }

   ngOnInit(){

   }

  ngOnChanges(changes) {

    if (this.plan && this.features && this.bodyType) {
        this.missingFeatures = JSON.parse(JSON.stringify(this.features));
        this.plan.features.forEach(feature => {
          this.currentFeatures.push(this.features.filter( (ftr) => ftr.code === feature)[0]);
          let last = this.currentFeatures[this.currentFeatures.length - 1];
          this.missingFeatures = this.missingFeatures.filter ( (ftr) => ftr.code !== last.code);
        });
        this.plan.price = this.plan.pricing[this.bodyType];

        
    }

    if (this.forUpgrade) {
      switch(this.plan.name) {
        case 'Standard': {
          this.plan.name = 'Elite';
          this.upgradePrice = this.planService.getUpdatePrice(this.purchasedPlan.name, 'Elite');
          break;
        }
        case 'Deluxe': {
          this.upgradePrice = this.planService.getUpdatePrice(this.purchasedPlan.name, 'Deluxe');
          break;
        }
        default: break;
      }
      
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
