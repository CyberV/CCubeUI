import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import featureList from 'assets/featurelist.json';
import contributionsList from 'assets/contributionslist.json';
import onePageScroll from 'assets/scripts/one-page-scroll.min';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { HeaderService } from 'app/header.service';
import { NotificationService } from 'app/services/notification.service';
import { PlanService } from 'app/services/plan.service';
import { ToastController } from '@ionic/angular';
//import {FlipCounterJs} from 'flip-counter-js';

declare var FlipCounterJs;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  startShow:boolean = false;
  doorstep:boolean = false;
  knowmore:boolean = true;
  daily:boolean = false;
  demo:boolean = false;
  contact: boolean = false;

  features: any;

  interval:any;

  featureList:any;
  contributions: any;
  appScroll:any;

  slideOpts;

  context:string = 'landing';
  currentUser:any;

  isLoggedIn:boolean;
  beginAnimation:boolean;
  showSlides:boolean;

  @ViewChildren('attention') attention : QueryList<ElementRef>;

  ssOptions = {
    initialSlide: 0,
    centeredSlides: true,
  slidesPerView: 1,
  autoplay: true,
  };

  showSignup:boolean;


  constructor(
    private router: Router, 
    private userService:UserService,
    private toastController:ToastController,
    private notificationService:NotificationService,
    private planService:PlanService,
    private headerService:HeaderService
    ) {
    this.featureList = featureList;
    this.contributions = contributionsList;
    this.isLoggedIn = false;
    this.showSignup = false;
    this.currentUser={};


        
    this.slideOpts = {
      initialSlide: 0,
      centeredSlides: true,
    slidesPerView: 1,
    autoplay: true,


      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
    };

    this.isLoggedIn = this.userService.isLoggedIn();
    this.showSlides = false;
    this.beginAnimation = false;
   }

   async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.startShow=true;

    // setTimeout(()=> {
    //   this.startShow=true;
    // }, 1000);
  }

  ngAfterViewInit() {
    // var el = document.querySelectorAll('section');
    // this.appScroll = new onePageScroll({
    //     el: el
    // });
  }

  onSlideChange(indx) {


    this.showSignup = indx == 2;
    
  }

  onSkip() {
    this.goToPlans();
  }

  start () {
    this.beginAnimation = true;

    setTimeout(() => {
      this.showSlides = true;
    }, 100);
  }

  goToPlans(forDemo = false) {
    //sessionStorage.removeItem('currentCar');

    if (forDemo) {
      //sessionStorage.setItem('forDemo', 'true');
      this.presentToast(`We need some basic details for the Demo.`)
    }

    if (this.isLoggedIn) {
      this.router.navigate(['/signup']);
    } else {
      this.router.navigate(['signup']);
    }
   
  }

  ionViewDidEnter() {
  //   var fc = new FlipCounterJs();
  //   //fc.
  
  // //FlipCounter
  // fc.increment(10); // Add 10
  }

  ionViewWillEnter() {
    this.headerService.hideHeader();
    this.currentUser = this.userService.getCurrentUser();
    let sub = this.planService.getCurrentSubscription();
    let subs = this.planService.getAllSubscriptions();

    debugger;
    if (this.userService.isLoggedIn()) {

      let notifs = this.notificationService.getAllNotifications();

      let showDashboard = (notifs.new.length > 0 || notifs.historical.length > 0 || notifs.read.length > 0) || (subs.length > 0);

      // if (showDashboard && sub) {
      //   alert('Exit?');
      // }
      if (showDashboard) {
        this.router.navigate(['/dashboard/service']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      
    }
  }

  loadMore() {
    this.knowmore = true;

    setTimeout(()=> {
      this.demo = true;

      setTimeout(()=> {
        this.contact = true;
        //this.grabAttention();
      }, 1000)
    }, 1000)
  }

  grabAttention() {
    this.interval = setInterval(()=> {
      console.log(this.attention.first.nativeElement.className.replace);
      this.attention.first.nativeElement.className = this.attention.first.nativeElement.className.replace('animate__backInLeft','');
      this.attention.first.nativeElement.className = this.attention.first.nativeElement.className.replace(' animate__heartBeat','');
      setTimeout(() => {
        this.attention.first.nativeElement.className += ' animate__heartBeat';
      },100);
      
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
