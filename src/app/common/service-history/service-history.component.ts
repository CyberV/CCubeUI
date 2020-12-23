import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'service-history',
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss'],
})
export class ServiceHistoryComponent implements OnInit {

  @Input() history:any;

  constructor(
    private notificationService:NotificationService
  ) {
    this.history = notificationService.getHistoricalNotifications();
  }

  ngOnInit() {}

}
