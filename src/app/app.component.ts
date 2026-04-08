import { Component, HostListener } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { planData } from './common/common.service';

import { Platform, MenuController, ToastController, AlertController, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from './header.service';
import { UserService } from './services/user.service';
import { CarService } from './services/car.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';

import { LoginService } from './login/login.service';
import { HeadingComponent } from './common/heading/heading.component';
import { NotifMenuComponent } from './common/notif-menu/notif-menu.component';

import { Initialize } from 'app/common/common.service';
import { NotificationService } from './services/notification.service';
import { DocumentService } from './services/document.service';
import { PlanService } from './services/plan.service';

declare var $;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  noBackNavigation: any;

  hideBackButton: boolean;
  fcmInitialized: boolean;

  headerText: string;
  currentUser: any;
  isLoggedIn: boolean;
  hasNewNotifications: boolean;

  headerType: string;      // text, view
  viewData: any;

  context: string;
  ready: boolean;

  notifToggleOpen: boolean;
  profilePic: any;

  lastTimeBackPress: number;

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private menu: MenuController,
    private userService: UserService,
    private alertController: AlertController,
    private documentService: DocumentService,
    private planService: PlanService,
    private carService: CarService,
    public toastController: ToastController,
    private popoverController: PopoverController,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) {

    this.initializeApp();

    this.hideBackButton = false;
    this.headerType = '';
    this.fcmInitialized = false;
    this.hasNewNotifications = false;
    this.ready = false;
    this.lastTimeBackPress = 0;

    this.noBackNavigation = [
      'select-car',
      'thanks',
      'landing'
    ];

    this.notifToggleOpen = false;

    this.context = '';

    this.route.url.subscribe((d) => {
      // console.log('route', this.route.snapshot['_routerState'].url);
    })



    this.headerService.listner().subscribe((evt: any) => {
      if (!evt.key) {
        return;
      }
      switch (evt.key) {
        case 'text': {
          this.headerText = evt.data;
          this.headerType = 'text';
          break;
        }
        case 'view': {
          this.viewData = evt.data;

          this.headerType = 'view';

          break;
        }
        case 'hide': {
          this.headerType = null;
        }
      }
    })
  }

  async ngOnInit() {

    this.profilePic = await this.documentService.getProfilePicture();
    this.headerText = ' ';
    this.headerType = 'text';

    this.ready = false;

    console.log('Before Init in APP')
    await Initialize(this.userService.getCurrentUser() ? this.userService.getCurrentUser().city || '' : '');
    this.planService.refreshPlans();
    console.log('After Init in APP Ready true');


    setTimeout(() => {
      this.ready = true;

    }, 100);

    //this.presentAlert('Demo');
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentPopover(ev) {

    this.notifToggleOpen = true;
    const popover = await this.popoverController.create({
      component: NotifMenuComponent,
      cssClass: 'notif-popover',
      // componentProps: {
      //   text: 'Some Notif'
      // },
      event: ev,
      showBackdrop: true,
      translucent: true
    });
    await popover.present();


    popover.onWillDismiss().then(() => {
      this.notifToggleOpen = false;
    });

    return;
  }

  async presentAlert(data = null) {
    let alert;
    if (data) {
      let cls = '';
      cls = data.title.toLowerCase().indexOf('reminder') > -1 ? 'bg-reminder' : cls;
      cls = data.title.toLowerCase().indexOf('congratulations') > -1 ? 'bg-congrats' : cls;
      cls = data.title.toLowerCase().indexOf('key') > -1 ? 'bg-collect-keys' : cls;

      alert = await this.alertController.create({
        cssClass: 'animate__animated  animate__fadeIn my-custom-class alert1 ' + cls,
        header: data.title || 'Notification',
        message: data.body || 'This is a demo message.',
        buttons: ['OK']
      });
    } else {
      alert = await this.alertController.create({
        cssClass: 'animate__animated  animate__fadeIn my-custom-class alert1 ',
        header: 'Alert',
        message: 'This is an alert message.',
        buttons: ['OK']
      });
    }


    await alert.present();


    if (data.disappearing) {
      setTimeout(() => {
        alert.dismiss();
      }, 2000);
    }

    alert.onWillDismiss().then(() => {

      if (data.action && data.action == 'refresh') {
        window.location.reload();
      }
      if (data.action && data.action == 'refer') {
        this.router.navigate(['/profile']);
      }
      if (data.action && data.action.indexOf('url==') == 0) {

        let url = data.action.substr(5);
        window.open(url, '_blank');
      }
      
      alert.cssClass = 'animate__animated  animate__fadeOut';

      // setTimeout(()=>{
      //   this.notificationService.markNotificationAsRead(data);
      // }, 1000);
    });
  }

  logout() {
    this.loginService.logout();
  }

  goBack() {
    window.history.back();
  }

  get pathname() {
    return window.location.pathname;
  }

  get isMobile() {
    return !this.platform.is('desktop');
  }

  async ngAfterViewInit() {
    this.menu.enable(true, 'first');
    this.hasNewNotifications = this.notificationService.getNewNotifications().length > 0;

    this.notificationService.events().subscribe((notifs: any) => {
      this.hasNewNotifications = notifs.new.length > 0;
    })

    // this.checkData().then((data) => {
    //   this.ready = true;
    //   console.log('Data READY', data);
    // })

  }

  async checkData() {
    let _p: any = planData;
    console.log('p', _p());
    if (!_p()) {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.checkData());
        }, 500);
      });
    } else {
      return true;
    }

  }

  @HostListener('document:ionBackButton', ['$event'])
  backAction(event: any): void { }

  timePeriodToExit = 2000;

  async onBackButton(event) {

    let allow = sessionStorage.getItem('allowBack');

    if (allow ? allow == 'true' : false) {
      return;
    }
    event.detail.register(100, async () => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    });

    // this.backCount++;
    // alert(this.backCount);

    if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
      // this.platform.exitApp(); // Exit from app
      navigator['app'].exitApp(); // work in ionic 4

    } else {
      const toast = await this.toastController.create({
        message: 'Press back again to exit.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      // console.log(JSON.stringify(toast));
      this.lastTimeBackPress = new Date().getTime();
    }
  }

  onDeactivate(comp) {
    console.log('Deactivated', comp.context, comp);

    if (comp.context == 'service') {
      this.backAction = function (): void { };
    }
  }

  async onActivate(comp) {
    //this.presentAlert();
    this.menu.enable(true, 'first');
    console.log('Activated', comp.context, comp);

    if (comp.context == 'landing' && this.userService.isLoggedIn()) {

      this.currentUser = this.userService.getCurrentUser();
      let showDashboard = this.currentUser.status == 'Active';

      // if (showDashboard && sub) {
      //   alert('Exit?');
      // }
      if (showDashboard) {
        this.router.navigate(['/dashboard/service']);
      } else {
        this.router.navigate(['/dashboard/select-car']);
      }
    }

    this.profilePic = await this.documentService.getProfilePicture();

    //this.notificationService.saveNewNotification({title:'Congratulations', 'body': 'Sample Notif', data: JSON.stringify({action: 'url==https://stackoverflow.com/questions/17142790/bootstrap-modal-not-working-at-all', car: {"model":"Duster","price":"Rs. 8.49 Lakh","details":"1498 cc | 20 kmpl | Petrol","bodyType":"suv","image":"./assets/icons/makers/models/149.png","id":149,"searchedBy":["9560879722"],"ownedBy":[],"missing":false,"_id":"5f9884d25d45340018b88841","carId":"149","maker":"RENAULT","regNo":"hr51bl0139","fuelType":"DIESEL","registeredOn":"11/23/2016","year":2016,"ownerName":"VIKRANT SIWACH","variant":"RENAULT DUSTER","fuelNorms":"BHARAT STAGE IV","chassisNo":"MEEHSRAWEG90XXXXX","engineNo":"K9KF830E0XXXXX","insuranceUpto":"2020-11-28T00:00:00.000Z","fitness":"2031-11-04T00:00:00.000Z","vehicleType":"MOTOR CAR (LMV)","age":"3 years","__v":0,"name":"duster"}, msg: 'Sameple ' + comp.context, data: {car: {image:"./assets/icons/makers/models/149.png",regNo: 'hr51bl0139'}}})});

    this.context = comp.context;

    if (comp.context == 'service') {
      this.backAction = this.onBackButton;
    }

    this.isLoggedIn = this.userService.isLoggedIn();

    if (this.isLoggedIn) {
      if (!this.fcmInitialized) {
        try {

          if (FCM && FCM.getToken()) {
            FCM.getToken().then((res: any) => {

              this.loginService.updateToken(res).subscribe(async (response: any) => {
                if (!response.success) {
                  this.presentAlert(response.errorMsg || JSON.parse(response.error));
                } else {

                  const pushPayload: object = await FCM.getInitialPushPayload();

                  if (pushPayload) {
                    this.notificationService.saveNewNotification(pushPayload);
                    this.presentAlert(pushPayload);
                  }
                  
                  this.fcmInitialized = true;
                  // this.presentAlert({
                  //   title: 'Hi there!',
                  //   body: 'Hope you\'re doing great.'
                  // })
                }
              });
            });

            FCM.onTokenRefresh().subscribe((res: any) => {
              this.loginService.updateToken(res).subscribe((response: any) => {
                // if (!response.success) {
                //   this.presentAlert(response.errorMsg || JSON.parse(response.error));
                // }
              });
            })
          }
        } catch (e) {
          console.log('Error in Notifications', e);
        }
      }
    }

    this.userService.listner().subscribe((evt: any) => {
      switch (evt.event) {
        case 'LOGGED_OUT': {
          this.menu.enable(false, 'first');
          break;

        }
        case 'LOGGED_IN': {
          this.menu.enable(true, 'first');
          break;
        }
        default: break;
      }
    });

    let usr = this.userService.getCurrentUser();

    if (usr) {
      this.currentUser = usr;
    }



    this.hideBackButton = this.checkContext(comp);


    $('.container').toArray().forEach(function (a) { a.scrollTop = 0; });

    //this.presentPopover();

  }

  toggleMenu() {
    this.menu.enable(true, 'first');
    this.menu.toggle('first');
  }

  goTo(context) {
    this.menu.close();
    switch (context) {
      case 'dashboard': {
        this.carService.clear();
        this.router.navigate(['/dashboard/select-car']);
        break;
      }
      case 'book': {
        //sessionStorage.setItem('forDemo', 'true');
        this.router.navigate(['/signup']);
        break;
      }
      case 'signup': {
        this.router.navigate(['/signup']);
        break;
      }
      case 'login': {
        this.router.navigate(['/signup/login']);
        break;
      }
      case 'profile': {
        this.router.navigate(['/profile']);
        break;
      }
      case 'refer': {
        this.router.navigate(['/refer']);
        break;
      }
      case 'contact-us': {
        this.router.navigate(['/contact']);
        break;
      }
      case 'about': {
        this.router.navigate(['/about']);
        break;
      }
      case 'service': {
        this.router.navigate(['/dashboard/service']);
        break;
      }
      default: break;
    }



  }

  checkContext(comp) {
    let hideBackButton = false;
    if (!comp) {
    } else if (!comp.context) {
    } else {
      hideBackButton = this.noBackNavigation.filter((path) => path == comp.context).length > 0;
    }

    return hideBackButton;

  }


  initializeApp() {
    /* To make sure we provide the fastest app loading experience 
       for our users, hide the splash screen automatically 
       when the app is ready to be used:
        
        https://capacitor.ionicframework.com/docs/apis/splash-screen#hiding-the-splash-screen
    */
    SplashScreen.hide();

    this.platform.ready().then((data) => {
      try {
        if (FCM && FCM.getToken()) {
          FCM.onNotification().subscribe((data: any) => {
            try {
              this.notificationService.saveNewNotification(data);
              this.presentAlert(data);
            } catch (err) {
              console.log('Error in Notification', err);
              alert(data);
            }

          });
        }
      } catch (err) {

      }
    });
  }
}
