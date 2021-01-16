import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RescheduleComponent } from '../reschedule/reschedule.component';

@Component({
  selector: 'weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.scss'],
})
export class WeeklyScheduleComponent implements OnInit {

  @Input() schedule:any;
  @Input() lastDate:any;
  @Input() hasAvailedFreeReschedule:boolean;

  startDate:any;

  constructor(
    private modalController:ModalController
  ) {
    this.schedule = [];
    this.startDate = "";

    this.schedule = [{
      day: 'Monday',
      task: 'Full Body Wash',
      addons: ['Sanitization'],
      adhocs:[]
    },
    {
      day: 'Tuesday',
      task: 'Micro Fiber Dusting',
      addons: ['New Fragrance'],
      adhocs:[]
    },{
      day: 'Wednesday',
      task: 'Leave',
      addons: [],
      adhocs:[]
    },{
      day: 'Thursday',
      task: 'Micro Fiber Dusting',
      addons: [],
      adhocs:['Deep Wash']
    },{
      day: 'Friday',
      task: 'Full Body Wash',
      addons: ['Sanitization'],
      adhocs:[]
    },{
      day: 'Saturday',
      task: 'Micro Fiber Dusting',
      addons: ['Sanitization','Tyre Polish'],
      adhocs:['Rust Protection']
    },{
      day: 'Sunday',
      task: 'Micro Fiber Dusting',
      addons: [],
      adhocs:[]
    },
  
  ];

  this.hasAvailedFreeReschedule = false;
   }

  ngOnInit() {
    if (this.schedule.length) {
      this.startDate = new Date(this.schedule[0].date).toString().split(' ').slice(1,3).join(' ');
    }
    
  }


  async openReschedule(schedule) {
    const modal = await this.modalController.create({
      component: RescheduleComponent,
      cssClass: 'plans-table-modal',
      componentProps: { 
        showClose: true,
        schedule: schedule,
        count: this.hasAvailedFreeReschedule ? 0 : 1,
        canReschedule: !schedule.isRescheduled,
        lastDate: this.lastDate
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data)=> {



    });
  }


}
