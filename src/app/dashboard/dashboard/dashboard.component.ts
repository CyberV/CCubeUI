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

    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: PlanTableComponent,
      cssClass: 'plans-table-modal',
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
  }

  async ngAfterViewInit() {

    sessionStorage.setItem('selectedPlan', null);

    this.isPlanSelected = false;

    let car = this.carService.getCurrentCar();
    
    
    if (car) {
      this.currentCar = car;
      this.isCarSelected = true;
    }

    if (this.isCarSelected) {
      await this.openModal();
    }
    

  }

  resetCar() {
    sessionStorage.setItem('currentCar', null);
    this.isCarSelected = false;
  }

  ionViewWillEnter() {
    console.log('Entering View in Dashboard Component');
  }



  showPlans(carDetails) {
    // this.currentCar = carDetails;


    // this.isCarSelected = true;


    // this.ngOnInit();
  }

  buyPlan(payload) {
    this.isPlanSelected = true;
    this.selectedPlan = payload.plan;
    this.goToCheckout();

  }

  onShowDetails(payload) {
    this.isPlanSelected = true;
    this.selectedPlan = payload.plan;
    sessionStorage.setItem('selectedPlan', JSON.stringify(this.selectedPlan));
    this.router.navigate(['/dashboard/plan']);

  }

  goToCheckout() {
    
    this.router.navigate(['/dashboard/checkout']);
  }



  

  categories = {
    slidesPerView: 2,
  };


}



