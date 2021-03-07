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

    if (!this.features) {
      this.features = this.planService.AllFeatures
    }

    if (this.plan && this.plan.features) {
        //this.missingFeatures = JSON.parse(JSON.stringify(this.features));
        this.plan.features.forEach(feature => {
          this.currentFeatures.push(this.features.filter( (ftr) => ftr.code === feature)[0]);
          //let last = this.currentFeatures[this.currentFeatures.length - 1];
          //this.missingFeatures = this.missingFeatures.filter ( (ftr) => ftr.code !== last.code);
        });

        // if (this.bodyType && !this.forUpgrade) {
        //   this.plan.price = this.plan.pricing[this.bodyType];
        // }
        

        
    }

  }

  onBuy() {
    let payload = {
      plan: this.plan,
      bodyType: this.bodyType
    }
    this.buyNow.emit(payload);
  }

  onShowDetails(feature=null) {
    let payload = {
      plan: this.plan,
      bodyType: this.bodyType,
      features: this.features,
      feature:feature
    }
    this.showDetails.emit(payload);
  }

}
