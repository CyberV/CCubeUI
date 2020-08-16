import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnInit {

  @Input() plan: any;
  @Input() features: any;

  @Output() changePlan = new EventEmitter();
  @Output() checkout = new EventEmitter();

  @ViewChild(IonContent, {static: true}) content: IonContent;

  currentFeatures: any;

  constructor() {
    this.currentFeatures = [];

  }

  ngOnInit() {

    if (this.plan && this.features) {
      this.currentFeatures = [];
      this.plan.features.forEach(feature => {
        this.currentFeatures.push(this.features.filter((ftr) => ftr.code === feature)[0]);
      });
    }

    this.content.scrollToTop();
  }

  sendChangePlan() {
    this.changePlan.emit();
  }

  sendCheckout() {
    this.checkout.emit(this.plan);
  }
}
