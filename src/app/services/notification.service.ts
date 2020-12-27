import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
  ) {

  }

  notificationsEmitter = new Subject();

  getAllNotifications() {
    return {
      new: this.getNewNotifications(),
      historical: this.getHistoricalNotifications(),
      read: this.getReadNotifications()
    }
  }


  events() {
    if (this.notificationsEmitter.closed) {
      this.notificationsEmitter = new Subject();
    }
    return this.notificationsEmitter;
  }

  sendNotificationUpdate() {
    this.notificationsEmitter.next( this.getAllNotifications());
  }

  getNewNotifications() {
    let data = localStorage.getItem('newNotifications');
    return data && data != "null" ? JSON.parse(data) : [];
  }

  getHistoricalNotifications() {
    let data = localStorage.getItem('historicalNotifications');
    return data && data != "null" ? JSON.parse(data) : [];
  }

  getReadNotifications() {
    let data = localStorage.getItem('readNotifications');
    return data && data != "null" ? JSON.parse(data) : [];
  }

  saveNewNotification(notif) {
    let notifs = this.getNewNotifications();
    notifs.push(notif);
    notif.date =  new Date().toString().split(' ').slice(1,3).join(' ');
    localStorage.setItem('newNotifications', JSON.stringify(notifs));

    this.sendNotificationUpdate();
  }

  markNotificationAsRead(notif) {
    let notifsNew = this.getNewNotifications();
    let notifsRead = this.getReadNotifications();

    let start = notifsNew.filter((n) => n.body == notif.body);

    if (start && start.length) {
      start = notifsNew.indexOf(start[0]);

      if (start > -1) {
        let read = notifsNew.splice(start, 1);
        
        Array.prototype.push.apply( read, notifsRead);

        localStorage.setItem('newNotifications', JSON.stringify(notifsNew));
        localStorage.setItem('readNotifications', JSON.stringify(read));

        this.sendNotificationUpdate();

      }
    }
  }

  moveNotificationsToHistory() {
    let notifsHistorical = this.getHistoricalNotifications();
    let notifsRead = this.getReadNotifications();

    Array.prototype.push.apply(notifsRead, notifsHistorical);

    localStorage.setItem('historicalNotifications', JSON.stringify(notifsRead));
    localStorage.setItem('readNotifications', JSON.stringify([]));
    this.sendNotificationUpdate();

  }

  clear() {
    localStorage.setItem('newNotifications', JSON.stringify([]));
    localStorage.setItem('historicalNotifications', JSON.stringify([]));
    localStorage.setItem('readNotifications', JSON.stringify([]));
    this.sendNotificationUpdate();
  }


}
