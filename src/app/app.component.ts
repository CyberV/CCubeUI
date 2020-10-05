import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { Platform, MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from './header.service';
import { UserService } from './services/user.service';

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

  constructor(
     private platform:Platform,
     private route: ActivatedRoute,
     private headerService:HeaderService,
     private router:Router,
     private menu:MenuController,
     private userService:UserService
     ) {
    this.initializeApp();
    this.hideBackButton = false;
    this.headerType = '';
    
    this.noBackNavigation = [
      'select-car',
      'thanks',
      'landing'
    ];

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
    
  }

  onDeactivate(comp){
    //console.log('Deactivated', data);
  }

  onActivate(comp) {

    this.isLoggedIn = this.userService.isLoggedIn();

    let usr = this.userService.getCurrentUser();
    if (usr) {
      this.currentUser = usr;
    }

    

    this.hideBackButton = this.checkContext(comp);


    $('.container').toArray().forEach(function(a) {a.scrollTop=0;})

  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  goTo(context) {
    switch(context) {
      case 'dashboard': {
        this.router.navigate(['/dashboard']);
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
      default: break;
    }

    this.menu.toggle('first');

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
