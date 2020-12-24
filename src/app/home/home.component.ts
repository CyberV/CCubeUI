import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import featureList from 'assets/featurelist.json';
import contributionsList from 'assets/contributionslist.json';
import onePageScroll from 'assets/scripts/one-page-scroll.min';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { HeaderService } from 'app/header.service';
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

  @ViewChildren('attention') attention : QueryList<ElementRef>;

  constructor(
    private router: Router, 
    private userService:UserService,
    private headerService:HeaderService
    ) {
    this.featureList = featureList;
    this.contributions = contributionsList;
    this.isLoggedIn = false;
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

  goToPlans() {
    //sessionStorage.removeItem('currentCar');

    if (this.isLoggedIn) {
      this.router.navigate(['/signup']);
    } else {
      this.router.navigate(['signup']);
    }
   
  }

  ionViewWillEnter() {
    this.headerService.setView('home',{});
    this.currentUser = this.userService.getCurrentUser();

    if (this.isLoggedIn) {

      if (this.currentUser.payments && this.currentUser.payments.length) {
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
