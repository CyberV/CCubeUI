import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import featureList from 'assets/featurelist.json';
import contributionsList from 'assets/contributionslist.json';
import onePageScroll from 'assets/scripts/one-page-scroll.min';
import { Router } from '@angular/router';
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

  @ViewChildren('attention') attention : QueryList<ElementRef>;

  constructor(private router: Router) {
    this.featureList = featureList;
    this.contributions = contributionsList;

        
    this.slideOpts = {
      initialSlide: 0,
      centeredSlides: true,
    slidesPerView: 1,


      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
    };
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
    sessionStorage.removeItem('currentCar');
    this.router.navigate(['plans']);
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
