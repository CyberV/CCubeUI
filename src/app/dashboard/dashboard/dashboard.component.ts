import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentCar:any;
  isCarSelected:boolean;
  slideOpts:any;

  constructor() {
    this.currentCar={};
    this.isCarSelected = false;

    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };
   }

  ngOnInit() {

    let car = sessionStorage.getItem('currentCar');
    if (car && car !="null") {
      this.currentCar = JSON.parse(car);
      this.isCarSelected = true;
    }
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
  }

  buyPlan(a) {
    console.log(a);
  }

}
