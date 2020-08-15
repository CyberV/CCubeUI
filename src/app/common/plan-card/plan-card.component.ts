import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent implements OnInit {

  @Input() plan: any;
  @Input() features: any;
  @Input() bodyType: string;

  currentFeatures: any;
  missingFeatures: any;

  constructor() {
    this.plan = {
      name: 'Standard',
      price: 500
    }
    this.currentFeatures = [];
    this.missingFeatures = [];

    this.bodyType="";
   }

  ngOnInit() {

    if (this.plan && this.features) {
        this.missingFeatures = JSON.parse(JSON.stringify(this.features));
        this.plan.features.forEach(feature => {
          this.currentFeatures.push(this.features.filter( (ftr) => ftr.code === feature)[0]);
          let last = this.currentFeatures[this.currentFeatures.length - 1];
          this.missingFeatures = this.missingFeatures.filter ( (ftr) => ftr.code !== last.code);
        });

        
    }

  }

}
