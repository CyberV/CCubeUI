import { Component, OnInit } from '@angular/core';
import plansList from 'assets/planslist.json';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import M from 'materialize-css';
import { PlanTableComponent } from 'app/common/plan-table/plan-table.component';

declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentCar:any;
  isCarSelected:boolean;
  
  currentPlans;
  
  slideOpts:any;

  constructor(
    private platform: Platform,
    private modalController: ModalController
  ) {
    this.currentCar={};
    this.isCarSelected = false;
    this.currentPlans = plansList.plans;

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
      await this.presentModal();
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
  }

  buyPlan(a) {
    console.log(a);
  }

}
