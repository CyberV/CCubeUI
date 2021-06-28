import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'service-history',
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss'],
})
export class ServiceHistoryComponent implements OnInit {

  @Input() history: any;
  @Input() carRegNo: string;

  constructor(

    private notificationService: NotificationService
  ) {

    notificationService.events().subscribe((data) => {
      this.refresh(data);
    });
  }

  refresh(entries) {
    try {


      console.log('entries', entries);
      this.history = entries.historical.filter((notif) => notif.data.car ? notif.data.car.regNo.toLowerCase() == this.carRegNo.toLowerCase() : false).reverse();
    } catch (e) {
      alert('eRror in ser his' + e);
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.carRegNo && this.carRegNo) {
      try {
      this.history = this.notificationService.getHistoricalNotifications().filter((notif) => notif.data.car ? notif.data.car.regNo.toLowerCase() == this.carRegNo.toLowerCase() : false).reverse();
      } catch (e) {
        alert('eRror in ser his' + e);
      }
    }
  }


}
