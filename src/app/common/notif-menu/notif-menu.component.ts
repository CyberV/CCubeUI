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
 
    let cls = '';
    cls = data.title.toLowerCase().indexOf('reminder') > -1 ? 'bg-reminder' : cls;
    cls = data.title.toLowerCase().indexOf('congratulations') > -1 ? 'bg-congrats' : cls;
    cls = data.title.toLowerCase().indexOf('key') > -1 ? 'bg-collect-keys' : cls;


      let alert = await this.alertController.create({
        cssClass: cls + ' animate__animated  animate__fadeIn ',
        header: data.title || 'Notification',
        message: data.body.msg || 'This is a demo message.',
        buttons: ['OK']
      });

      alert.onWillDismiss().then(()=> {
        alert.cssClass = 'animate__animated  animate__fadeOut';
      });

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
    this.newItems = [{"title":"Congratulations","body":{"msg":"Elite Plan Active for 0139","data":{"car":{"model":"Duster","price":"Rs. 8.49 Lakh","details":"1498 cc | 20 kmpl | Petrol","bodyType":"suv","image":"./assets/icons/makers/models/149.png","id":149,"searchedBy":["9560879722"],"ownedBy":[],"missing":false,"_id":"5f9884d25d45340018b88841","carId":"149","maker":"RENAULT","regNo":"Hr51bl0139","fuelType":"DIESEL","registeredOn":"23/11/2016","year":2016,"ownerName":"VIKRANT SIWACH","variant":"RENAULT DUSTER","fuelNorms":"BHARAT STAGE IV","chassisNo":"MEEHSRAWEG90XXXXX","engineNo":"K9KF830E0XXXXX","insuranceUpto":"2020-11-28T00:00:00.000Z","fitness":"2031-11-04T00:00:00.000Z","vehicleType":"MOTOR CAR (LMV)","age":"3 years","__v":0,"name":"duster"}}}},
    {"title":"Need your keys","body":{"msg":"Key Collection tomorrow for 2022","data":{"car":{"model":"Duster","price":"Rs. 8.49 Lakh","details":"1498 cc | 20 kmpl | Petrol","bodyType":"suv","image":"./assets/icons/makers/models/81.png","id":149,"searchedBy":["9560879722"],"ownedBy":[],"missing":false,"_id":"5f9884d25d45340018b88841","carId":"149","maker":"RENAULT","regNo":"Hr51bl0139","fuelType":"DIESEL","registeredOn":"23/11/2016","year":2016,"ownerName":"VIKRANT SIWACH","variant":"RENAULT DUSTER","fuelNorms":"BHARAT STAGE IV","chassisNo":"MEEHSRAWEG90XXXXX","engineNo":"K9KF830E0XXXXX","insuranceUpto":"2020-11-28T00:00:00.000Z","fitness":"2031-11-04T00:00:00.000Z","vehicleType":"MOTOR CAR (LMV)","age":"3 years","__v":0,"name":"duster"}}}},
    {"title":"Payment Reminder","body":{"msg":"Payment Pending for 2022","data":{"car":{"model":"Duster","price":"Rs. 8.49 Lakh","details":"1498 cc | 20 kmpl | Petrol","bodyType":"suv","image":"./assets/icons/makers/models/81.png","id":149,"searchedBy":["9560879722"],"ownedBy":[],"missing":false,"_id":"5f9884d25d45340018b88841","carId":"149","maker":"RENAULT","regNo":"Hr51bl0139","fuelType":"DIESEL","registeredOn":"23/11/2016","year":2016,"ownerName":"VIKRANT SIWACH","variant":"RENAULT DUSTER","fuelNorms":"BHARAT STAGE IV","chassisNo":"MEEHSRAWEG90XXXXX","engineNo":"K9KF830E0XXXXX","insuranceUpto":"2020-11-28T00:00:00.000Z","fitness":"2031-11-04T00:00:00.000Z","vehicleType":"MOTOR CAR (LMV)","age":"3 years","__v":0,"name":"duster"}}}}];
    this.recentItems = this.notificationService.getReadNotifications();
    this.recentItems = [{"title":"Congratulations","body":{"msg":"Elite Plan Purchased for 0139","data":{"car":{"model":"Duster","price":"Rs. 8.49 Lakh","details":"1498 cc | 20 kmpl | Petrol","bodyType":"suv","image":"./assets/icons/makers/models/149.png","id":149,"searchedBy":["9560879722"],"ownedBy":[],"missing":false,"_id":"5f9884d25d45340018b88841","carId":"149","maker":"RENAULT","regNo":"Hr51bl0139","fuelType":"DIESEL","registeredOn":"23/11/2016","year":2016,"ownerName":"VIKRANT SIWACH","variant":"RENAULT DUSTER","fuelNorms":"BHARAT STAGE IV","chassisNo":"MEEHSRAWEG90XXXXX","engineNo":"K9KF830E0XXXXX","insuranceUpto":"2020-11-28T00:00:00.000Z","fitness":"2031-11-04T00:00:00.000Z","vehicleType":"MOTOR CAR (LMV)","age":"3 years","__v":0,"name":"duster"}}}}];
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
