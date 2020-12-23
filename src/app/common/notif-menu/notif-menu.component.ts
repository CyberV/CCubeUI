import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';

@Component({
  selector: 'notif-menu',
  templateUrl: './notif-menu.component.html',
  styleUrls: ['./notif-menu.component.scss'],
})
export class NotifMenuComponent implements OnInit {

  @Input() newItems: any;
  @Input() recentItems: any;

  constructor(
    private notificationService:NotificationService,
    private alertController: AlertController,
    private popoverController:PopoverController,
    private toastController: ToastController
    ) {
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

  async presentAlert(data = null) {
    let alert;
    if (data) {
      alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: data.title || 'Notification',
        message: data.body || 'This is a demo message.',
        buttons: ['OK']
      });
    } else {
      alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        subHeader: 'Subtitle',
        message: 'This is an alert message.',
        buttons: ['OK']
      });
    }


    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.refreshNotifications();
  }

  refreshNotifications() {
    this.newItems = this.notificationService.getNewNotifications();
    this.recentItems = this.notificationService.getReadNotifications();
  }

  clearNotifications() {
    this.notificationService.moveNotificationsToHistory();
    this.popoverController.dismiss();


    this.presentToast('Read Notifications moved to Service History!');
  }

  readNotification(item) {
    this.presentAlert(item);
    this.popoverController.dismiss();

    setTimeout(()=>{
      this.notificationService.markNotificationAsRead(item);
      this.refreshNotifications();
    }, 1000);
    
  }
}
