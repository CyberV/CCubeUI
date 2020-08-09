import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent implements OnInit {

  @Input() plan: any;

  constructor() {
    this.plan = {
      name: 'Standard',
      price: 500
    }
   }

  ngOnInit() {}

}
