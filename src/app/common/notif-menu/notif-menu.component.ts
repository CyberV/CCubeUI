import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'notif-menu',
  templateUrl: './notif-menu.component.html',
  styleUrls: ['./notif-menu.component.scss'],
})
export class NotifMenuComponent implements OnInit {

  @Input() newItems: any;
  @Input() recentItems: any;

  constructor() {
    this.recentItems = [{
      label: 'Plan Active for 0139'
    },
    {
      label: 'Plan Purchased for 0139'
    },
    {
      label: 'Account Created Successfully!'
    }
    ];

    this.newItems = [{
      label: 'Try our Addons! Service will start from Tomorrow!'
    },
    {
      label: 'Going somewhere Fancy? Quick Book Full Body Wash now'
    },
    {
      label: 'Service Completed. Enjoy the CCube Expierience!'
    }
    ];

  }

  ngOnInit() { }

}
