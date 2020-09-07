import { Component, OnInit } from '@angular/core';
import plansList from 'assets/planslist.json';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import M from 'materialize-css';
import { PlanTableComponent } from 'app/common/plan-table/plan-table.component';
import { Router } from '@angular/router';
import { ModalPage } from 'app/modal/modal.page';
import { CarService } from 'app/services/car.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentCar: any;
  selectedPlan: any;

  isCarSelected: boolean;
  isPlanSelected: boolean;
  addOns: any;

  currentPlans;

  slideOpts: any;

  constructor(
    private carService: CarService,
    private platform: Platform,
    public modalController: ModalController,
    private router: Router
  ) {
    this.currentCar = {};
    this.isCarSelected = false;
    this.currentPlans = plansList;
    this.isPlanSelected = false;
    this.selectedPlan = {};

    console.log('M', M);

    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };

    this.addOns = [
      {
        title:'Dry Cleaning',
        rating: 4.5,
        icon: 'ppe'
      },
      {
        title:'Polishing',
        rating: 4.5,
        icon: 'sanitize'
      },
      {
        title:'Waxing',
        rating: 4.5,
        icon: 'screening'
      },
      {
        title:'Paint Protection',
        rating: 4.5,
        icon: 'solution'
      },
      {
        title:'Rust Protection',
        rating: 4.5,
        icon: 'doorstep'
      },
        {
        title:'Dry Cleaning',
        rating: 4.5,
        icon: 'notification'
      }
    ]
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: PlanTableComponent,
      cssClass: 'my-custom-class',
      componentProps: { 
        bodyType: 'sedan',
        showClose: true
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data)=> {

      if (data && data.data) {
        let fltrdPlans = this.currentPlans.plans.filter( (plan) => plan.name.toLowerCase() == data.data.planName.toLowerCase());

        if (fltrdPlans && fltrdPlans.length) {
          this.buyPlan( {
            plan: fltrdPlans[0]
          });
        }
      }

    });
  }

  get isMobile() {
    return !this.platform.is('desktop');
  }


  async ngOnInit() {

    let car = this.carService.getCurrentCar();
    
    
    if (car) {
      this.currentCar = car;
      this.isCarSelected = true;
    }

    

    if (this.isCarSelected) {
      await this.openModal();
    }
  }

  ngAfterViewInit() {
    $('.carousel').carousel();
  }

  resetCar() {
    sessionStorage.setItem('currentCar', null);
    this.isCarSelected = false;
  }

  ionViewWillEnter() {
    console.log('in view enter');
  }



  showPlans(carDetails) {
    this.currentCar = carDetails;
    sessionStorage.setItem('currentCar', JSON.stringify(carDetails));

    this.isCarSelected = true;
    this.isPlanSelected = false;

    this.ngOnInit();
  }

  buyPlan(payload) {
    console.log(payload);
    this.isPlanSelected = true;
    this.selectedPlan = payload.plan;
    this.goToCheckout();

  }

  onShowDetails(payload) {
    this.isPlanSelected = true;
    this.selectedPlan = payload.plan;


  }

  goToCheckout() {
    sessionStorage.setItem('selectedPlan', JSON.stringify(this.selectedPlan));
    this.router.navigate(['/dashboard/checkout']);
  }



  options = {
    centeredSlides: false,
    slidesPerView: 2.5,
    spaceBetween: 15,
  };

  categories = {
    slidesPerView: 2,
  };


}



