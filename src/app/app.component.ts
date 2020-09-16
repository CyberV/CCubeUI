import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  noBackNavigation:any;
  
  hideBackButton:boolean;

  constructor(
     private platform:Platform,
     private route: ActivatedRoute,
     private router:Router
     ) {
    this.initializeApp();
    this.hideBackButton = false;
    
    this.noBackNavigation = [
      'select-car',
      'thanks',
      'landing'
    ];

    this.route.url.subscribe( (d)=> {
      // console.log('route', this.route.snapshot['_routerState'].url);
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
    //console.log('Activated', data);
    this.hideBackButton = this.checkContext(comp);
    setTimeout( ()=> {
      //document.getElementById('trigger-to-top').click();
    }, 200);

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
