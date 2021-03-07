import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from 'app/services/plan.service';
import { CarService } from 'app/services/car.service';
import { ToastController } from '@ionic/angular';
import { getConfigValue } from '../common.service';
declare var $;
@Component({
  selector: 'ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss'],
})
export class AdsListComponent implements OnInit {

  ads: any;

  @Output() action = new EventEmitter();
  constructor(
    private router:Router,
    private planService: PlanService,
    private carService: CarService,
    private toastController:ToastController
  ) {

    this.ads = [];
    // this.ads = [{
    //   title: 'Earn Rs 75 for every 3 Referrals',
    //   description: 'Refer your friends and lets save water together. ',
    //   discount: 'Rs. 75',
    //   image: '2',
    //   type: 'referral',
    //   action: 'referral',
    // },
    // {
    //   title: 'Flat 25% OFF on Quarterly Plans',
    //   description: 'We wish to serve you for as long as possible. Lets start with 3 months.',
    //   discount: '25 %',
    //   image: '3',
    //   type: 'coupon',
    //   action: 'quarterly',
    // },
    // {
    //   title: 'Upgrade to Elite Plan',
    //   description: 'For an additional Rs. 150 per month, enjoy all our Addons with the Elite Plan.',
    //   discount: null,
    //   image: '1',
    //   type: 'upgrade',
    //   action: 'upgrade',
    // },
    // {
    //   title: 'Sparkling Clean in 30 mins',
    //   description: 'Try our Full Body Wash Addon for that important meeting.',
    //   discount: null,
    //   image: '4',
    //   type: 'addon',
    //   action: 'addon:FBW',
    // },
    // {
    //   title: 'Flat OFF for your Next Car',
    //   description: 'Rs 100 Off on your next car. The more the merrier.',
    //   discount: "Rs 100",
    //   image: '1',
    //   type: 'nextcar',
    //   action: 'addcar',
    // }
    // ];
  }

  ngOnInit() {

    let ads = getConfigValue('COUPON_CONFIG');

    if (ads && ads.length) {
      this.ads = ads;
    }
   }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  selectAd(ad) {

    if (ad.action.indexOf('addon:') > -1) {

      this.planService.includeAddonWithCode(ad.action.split(':')[1]);
      this.router.navigate(['/dashboard/addon'])

    } else {

    switch(ad.action) {
      case'addcar': {
        this.carService.clear();
        this.router.navigate(['/dashboard/select-car'])
        break;
      }
      case'upgrade': {
        this.presentToast('Upgrade your car.');

        break;
      }
      case'quarterly': {
        this.presentToast('Buy/Renew a Plan to see quarterly benefits.');
        this.planService.updatePlanDuration('quarterly');

        break;
      }
      case'referral': {
        this.router.navigate(['/refer'])
        break;
      }
      break;
    }
  }
  }



  ngAfterViewInit() {
    $(".carousel").on("touchstart", function (event) {
      var xClick = event.originalEvent.touches[0].pageX;
      $(this).one("touchmove", function (event) {
        var xMove = event.originalEvent.touches[0].pageX;
        if (Math.floor(xClick - xMove) > 5) {
          $('.carousel').carousel('next');
        }
        else if (Math.floor(xClick - xMove) < -5) {
          $('.carousel').carousel('prev');
        }
      });
      $(".carousel").on("touchend", function () {
        $(this).off("touchmove");
      });
    });
  }

}
