import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { Platform, MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from './header.service';

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

  headerType:string;      // text, view
  viewData:any;

  constructor(
     private platform:Platform,
     private route: ActivatedRoute,
     private headerService:HeaderService,
     private router:Router,
     private menu:MenuController
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
          this.headerText = evt.data;
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
    //console.log('Activated', data);
    this.hideBackButton = this.checkContext(comp);
    // setTimeout( ()=> {
    //   //document.getElementById('trigger-to-top').click();
    // }, 200);

    $('.container').toArray().forEach(function(a) {a.scrollTop=0;})

  }

  // openFirst() {
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  // }

  // openEnd() {
  //   this.menu.open('end');
  // }

  // openCustom() {
  //   this.menu.enable(true, 'custom');
  //   this.menu.open('custom');
  // }

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
