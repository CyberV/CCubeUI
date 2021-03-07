import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlanService } from 'app/services/plan.service';
import { getConfigValue } from '../common.service';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {

  @Output() toggle = new EventEmitter();
  open: boolean;
  activePlanDuration: string;

  discountValue:number;

  constructor(
    private planService: PlanService
  ) {
    this.open = false;
    this.activePlanDuration = 'monthly';
    this.discountValue = 20;
  }

  ngOnInit() {
    this.open = this.planService.getPlanDuration() == 'quarterly';

    this.discountValue = getConfigValue('DISCOUNT_QUARTERLY');
    //this.getPlanDuration();
  }




  setActivePlanDuration(activeIndex) {

    this.open = activeIndex == 1;

    this.sendToggle();

    // if (activeDuration !== this.activePlanDuration) {
    //   this.activePlanDuration = activeDuration;
    //   const options = document.getElementsByClassName("plan_duration");
    //   for (let i = 0, x = options.length; i < x; i++) {
    //     if (options[i].innerHTML !== activeDuration) {
    //       options[i].classList.remove("active_option");
    //     }
    //   }
    //   options[activeIndex].classList.add("active_option");

    //   const plan = allPlansList(activeCarType);
    //   let { standard, deluxe, elite } = plan;

    //   if (activeDuration === "Quarterly") {
    //     standard = Math.floor(standard * 3 - (standard * 60) / 100);
    //     deluxe = Math.floor(deluxe * 3 - (deluxe * 60) / 100);
    //     elite = Math.floor(elite * 3 - (elite * 60) / 100);
    //   }
    //   document.getElementById("standard").innerHTML = standard;
    //   document.getElementById("deluxe").innerHTML = deluxe;
    //   document.getElementById("elite").innerHTML = elite;
    //   document.getElementById("standard_mobile").innerHTML = standard;
    //   document.getElementById("deluxe_mobile").innerHTML = deluxe;
    //   document.getElementById("elite_mobile").innerHTML = elite;
    //   document.getElementById("standard_modal_price").innerHTML = standard;
    //   document.getElementById("deluxe_modal_price").innerHTML = deluxe;
    //   document.getElementById("elite_modal_price").innerHTML = elite;
    // }
  }


  // getPlanDuration() {
  //   const options = document.getElementsByClassName("plan_duration");
  //   for (let i = 0, x = options.length; i < x; i++) {
  //     options[i].addEventListener("click", (e) => {
  //       this.setActivePlanDuration(i);
  //     });
  //   }
  // }


  sendToggle() {
    console.log('Switch yes', this.open);
    this.planService.updatePlanDuration(this.open ? 'quarterly' : 'monthly');
    this.toggle.emit(this.open ? 'quarterly' : 'monthly');
  }

}
