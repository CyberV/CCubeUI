import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private platform:Platform, private route: ActivatedRoute) {
    this.initializeApp();
    this.route.outlet

    this.route.url.subscribe( (d)=> {
      console.log('route', this.route.snapshot['_routerState'].url);
    })
  }

  get pathname() {
    return window.location.pathname;
  }

  get isMobile() {
    return !this.platform.is('desktop');
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
