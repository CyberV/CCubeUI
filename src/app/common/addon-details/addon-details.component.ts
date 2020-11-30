import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanService } from 'app/services/plan.service';



@Component({
  selector: 'addon-details',
  templateUrl: './addon-details.component.html',
  styleUrls: ['./addon-details.component.scss'],
})
export class AddonDetailsComponent implements OnInit {

  @Input() addon:any;
  @Input() adhoc:any;

  @Output() changeAddon = new EventEmitter();
  @Output() scheduleLater = new EventEmitter();

  @Output() scheduleDate = new EventEmitter();

  minDate: Date;
  maxDate: Date;

  selectedDate:any;
  laterSelected:boolean;

  startDate:any;
  isAdhoc:boolean;
  constructor(
    private planService:PlanService
  ) {
    this.isAdhoc = false;
    this.laterSelected = true;

  }

  selectDate(date) {
    this.laterSelected = false;
    this.scheduleDate.emit(new Date(date));
  }

  sendScheduleLater() {
    let payload = {};
    if (this.isAdhoc) {
      payload = {
        isAdhoc: true,
        adhoc: this.adhoc
      }
    } else {

        payload = {
          isAdhoc: false,
          addon: this.addon
        
      }
    }
    this.scheduleLater.emit(payload);
  }

  ngOnInit() {
    if (this.adhoc && !this.addon) {
      this.addon = this.adhoc;
      this.isAdhoc = true;

      this.startDate = 'Tomorrow';
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      this.minDate = new Date(currentYear, currentMonth, currentDate + 1);
      this.maxDate = new Date(currentYear, currentMonth + 1, currentDate);
    } else if (this.addon) {
      this.isAdhoc = false;
      let currentSubs = this.planService.getCurrentSubscription();
      let startDate = new Date(currentSubs.startDate);

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const planDate = startDate.getDate();


      let diff = -1 * (planDate - (new Date().getDate()));
      console.log('Diff in days from cycle date', diff);

      if (diff <= 10) {
        this.startDate = 'Tomorrow';
      } else {
        let nextCycleDate = new Date(currentYear, currentMonth+1, planDate);
        this.startDate = nextCycleDate.toString().split(' ').slice(1,3).join(' ');
      }
    }
    


  }



}
