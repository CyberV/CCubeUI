import { Component, OnInit } from '@angular/core';
import plansList from 'assets/planslist.json';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import M from 'materialize-css';
import { PlanTableComponent } from 'app/common/plan-table/plan-table.component';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentCar:any;
  selectedPlan: any;

  isCarSelected: boolean;
  isPlanSelected: boolean;
  
  currentPlans;
  
  slideOpts:any;

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private router: Router
  ) {
    this.currentCar={};
    this.isCarSelected = false;
    this.currentPlans = plansList;
    this.isPlanSelected = false;
    this.selectedPlan = {};

    console.log('M', M);

    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };
   }

   get isMobile() {
    return !this.platform.is('desktop');
  }

  async ngOnInit() {

    let car = sessionStorage.getItem('currentCar');
    if (car && car !="null") {
      this.currentCar = JSON.parse(car);
      this.isCarSelected = true;
    }

    if(this.isCarSelected) {
      //await this.presentModal();
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

  async presentModal() {
    const modal = await this.modalController.create({
      component: PlanTableComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  showPlans(carDetails) {
    this.currentCar = carDetails;
    sessionStorage.setItem('currentCar', JSON.stringify(carDetails));

    this.isCarSelected = true;
    this.isPlanSelected = false;
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
    sessionStorage.setItem('selectedPlan',JSON.stringify(this.selectedPlan));
    this.router.navigate(['/dashboard/checkout']);
  }

}
