import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PlanService } from 'app/services/plan.service';
import { getConfigValue } from '../common.service';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {

  @Output() toggle = new EventEmitter();

  @Input() slim:boolean;
  open: boolean;
  @Input('planDuration') activePlanDuration: string;

  discountValue:number;

  constructor(
    private planService: PlanService
  ) {
    this.open = false;
    this.activePlanDuration = 'monthly';
    this.discountValue = 20;
    this.slim = false;
  }

  ngOnInit() {
    this.open = this.planService.getPlanDuration() == 'quarterly';

    this.discountValue = getConfigValue('DISCOUNT_QUARTERLY');

    this.planService.listner().subscribe((d:any) => {
      if (d.key == 'planDuration') {
        this.open = d.value == 'quarterly';
      }
    })
    //this.getPlanDuration();
  }

  ngOnChanges(changes) {
    if (this.activePlanDuration.length) {
      this.setActivePlanDuration(this.activePlanDuration);
    }
  }



  setActivePlanDuration(activeIndex) {

    this.open = activeIndex == 'quarterly';

    this.sendToggle();
  }

  sendToggle() {
    console.log('Switch yes', this.open);
    this.planService.updatePlanDuration(this.open ? 'quarterly' : 'monthly');
    this.toggle.emit(this.open ? 'quarterly' : 'monthly');
  }

}
