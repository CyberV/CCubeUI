import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import plansList from 'assets/planslist.json';
import { planData } from 'app/common/common.service';
import { scrollElementToTop } from 'app/util/util';

declare var $;
@Component({
  selector: 'plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnInit {

  @Input() plan: any;
  @Input() features: any;
  @Input() activeFeature;

  @Input() compact:boolean;
  @Input() hideCta:boolean;

  @Output() changePlan = new EventEmitter();
  @Output() checkout = new EventEmitter();



  @ViewChild(IonContent, {static: true}) content: IonContent;

  currentFeatures: any;

  isActive: boolean = true;

  constructor() {
    this.currentFeatures = [];
    this.compact = false;
    this.hideCta = false;
  }

  async ngOnInit() {

    if (!(this.features && this.features.length > 0)) {
      this.features = (await planData()).plansList.features;
    }

    if (this.plan && this.features) {
      this.currentFeatures = [];
      this.plan.features.forEach(feature => {
        this.currentFeatures.push(this.features.filter((ftr) => ftr.code === feature)[0]);
      });
    }

  }

  ngOnChanges(changes) {
  }

  ngAfterViewInit() {
    if (this.activeFeature) {
      console.log('Ready to Show feature', this.activeFeature);
      setTimeout(()=> {
        scrollElementToTop($('#' + this.activeFeature)[0]);

      }, 1000);
    }
  }


  sendChangePlan() {
    this.changePlan.emit();
  }

  sendCheckout() {
    this.checkout.emit(this.plan);
  }
}
