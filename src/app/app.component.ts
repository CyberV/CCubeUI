import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { planData } from './common/common.service';

import { Platform, MenuController, ToastController, AlertController, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from './header.service';
import { UserService } from './services/user.service';
import { CarService } from './services/car.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
//import { FCM } from '@ionic-native/fcm/ngx';
//import {FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic'
//import { FCM } from '../../plugins/cordova-plugin-fcm-with-dependecy-updated/ionic/ngx/FCM';

import { LoginService } from './login/login.service';
import { HeadingComponent } from './common/heading/heading.component';
import { NotifMenuComponent } from './common/notif-menu/notif-menu.component';

import { Initialize } from 'app/common/common.service';
import { NotificationService } from './services/notification.service';

declare var $;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  noBackNavigation: any;

  hideBackButton: boolean;
  fcmInitialized:boolean;

  headerText: string;
  currentUser: any;
  isLoggedIn: boolean;
  hasNewNotifications:boolean;

  headerType: string;      // text, view
  viewData: any;

  context: string;
  ready:boolean;

  notifToggleOpen:boolean;

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private menu: MenuController,
    private userService: UserService,
    private alertController: AlertController,
    private carService: CarService,
    public toastController: ToastController,
    private popoverController:PopoverController,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) {

    this.initializeApp();

    this.hideBackButton = false;
    this.headerType = '';
    this.fcmInitialized = false;
    this.hasNewNotifications = false;
    this.ready = false;

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
      }
    })
  }

  async ngOnInit() {

    this.ready = false;
    console.log('Before Init in APP')
    await Initialize(this.userService.getCurrentUser() ? this.userService.getCurrentUser().city || '' : '');
    console.log('After Init in APP Ready true')

    setTimeout(()=> {
      this.ready = true;

    }, 1000);

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


     popover.onWillDismiss().then(()=>{
       this.notifToggleOpen = false;
     });

     return;
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

    this.notificationService.events().subscribe((notifs:any) => {
      this.hasNewNotifications = notifs.new.length > 0;
    })

    // this.checkData().then((data) => {
    //   this.ready = true;
    //   console.log('Data READY', data);
    // })

  }

  async checkData() {
    let _p:any = planData;
    console.log('p',_p());
    if(!_p()) {
      return await new Promise((resolve) => {
        setTimeout( ()=> {
          resolve (this.checkData());
        }, 500);
      });
    } else {
      return true;
    }
    
  }

  onDeactivate(comp) {
    //console.log('Deactivated', data);
  }

  onActivate(comp) {

    //this.notificationService.saveNewNotification({title:'Congratulations', body: {msg: 'Sameple ' + comp.context, data: {car: {image:"./assets/icons/makers/models/149.png",regNo: 'hr51bl0139'}}}});

    this.context = comp.context;

    this.isLoggedIn = this.userService.isLoggedIn();

    this.userService.listner().subscribe((evt: any) => {
      switch (evt.event) {
        case 'LOGGED_OUT': {
          this.menu.enable(false, 'first');
          break;

        }
        case 'LOGGED_IN': {
          this.menu.enable(true, 'first');

          if (!this.fcmInitialized) {
            try {
              
              if (FCM &&  FCM.getToken()) {
                FCM.getToken().then((res:any) => {

                  this.loginService.updateToken(res).subscribe((response:any) => {
                    if (!response.success) {
                      this.presentAlert(response.errorMsg || JSON.parse(response.error));
                    } else {
                      this.fcmInitialized = true;
                      // this.presentAlert({
                      //   title: 'Hi there!',
                      //   body: 'Hope you\'re doing great.'
                      // })
                    }
                  });
                });

                FCM.onTokenRefresh().subscribe((res:any) => {
                  this.loginService.updateToken(res).subscribe((response:any) => {
                    // if (!response.success) {
                    //   this.presentAlert(response.errorMsg || JSON.parse(response.error));
                    // }
                  });
                })
              }
            } catch(e) {
              console.log('Error in Notifications', e);
            }
          }

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
          FCM.onNotification().subscribe((data:any) => {
            try {
              this.notificationService.saveNewNotification(data);
              this.presentAlert(data);
            } catch(err) {
              console.log('Error in Notification', err);
              alert(data);
            }
           
          });
        }
      } catch(err) {
        
      }
    });
  }
}
