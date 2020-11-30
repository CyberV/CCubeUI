import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.scss'],
})
export class WeeklyScheduleComponent implements OnInit {

  @Input() schedule:any;

  constructor() {
    this.schedule = [];

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
  
  ]
   }

  ngOnInit() {}

}
