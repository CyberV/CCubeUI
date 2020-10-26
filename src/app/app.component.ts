import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { Platform, MenuController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from './header.service';
import { UserService } from './services/user.service';
import { CarService } from './services/car.service';
//import { FCM } from '@ionic-native/fcm/ngx';
//import {FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic'
//import { FCM } from '../../plugins/cordova-plugin-fcm-with-dependecy-updated/ionic/ngx/FCM';

import { LoginService } from './login/login.service';

declare var $;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  noBackNavigation:any;
  
  hideBackButton:boolean;

  headerText:string;
  currentUser:any;
  isLoggedIn:boolean;

  headerType:string;      // text, view
  viewData:any;

  context:string;

  constructor(
     private platform:Platform,
     private route: ActivatedRoute,
     private headerService:HeaderService,
     private router:Router,
     private menu:MenuController,
     private userService:UserService,
     private carService:CarService,
     public toastController: ToastController,
     private loginService:LoginService
     ) {

    this.initializeApp();

    this.hideBackButton = false;
    this.headerType = '';
    
    this.noBackNavigation = [
      'select-car',
      'thanks',
      'landing'
    ];

    this.context = '';

    this.route.url.subscribe( (d)=> {
      // console.log('route', this.route.snapshot['_routerState'].url);
    })

    

    this.headerService.listner().subscribe( (evt:any)=> {
      if (!evt.key) {
        return;
      }
      switch(evt.key) {
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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  goBack(){
    window.history.back();
  }

  get pathname() {
    return window.location.pathname;
  }

  get isMobile() {
    return !this.platform.is('desktop');
  }

  ngAfterViewInit() {
    this.menu.enable(true, 'first');
    
  }

  onDeactivate(comp){
    //console.log('Deactivated', data);
  }

  onActivate(comp) {

    this.context = comp.context;

    this.isLoggedIn = this.userService.isLoggedIn();

    this.userService.listner().subscribe((evt:any) => {
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


    $('.container').toArray().forEach(function(a) {a.scrollTop=0;})

  }

  toggleMenu() {
    
    this.menu.toggle('first');
  }

  goTo(context) {
    this.menu.close();
    switch(context) {
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
      hideBackButton = this.noBackNavigation.filter( (path) => path == comp.context).length > 0;
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
  }
}
