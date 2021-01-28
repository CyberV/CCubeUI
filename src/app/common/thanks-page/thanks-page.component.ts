import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'app/header.service';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks-page.component.html',
  styleUrls: ['./thanks-page.component.scss'],
})
export class ThanksPageComponent implements OnInit {

  constructor(
    private headerService:HeaderService, 
    private router:Router,
    private planService: PlanService,
    private carService:CarService
    ) { }

  public context: string;
  clearInterval:any;

  payment:any;
  order:any

  get startDate()  {

    return this.payment ?  this.payment.plan ? new Date(this.payment.startDate).toLocaleString() :  new Date(this.payment.startDate || this.payment.paymentDate).toLocaleString() : null;
  }

  ngOnInit() {

    this.context = "thanks";
    this.payment = null;
  }

  ionViewWillEnter() {
    this.payment = JSON.parse(sessionStorage.getItem('currentPayment'));
    this.order=  this.planService.getCurrentOrder();

    if (this.order.addons.length) {
      this.headerService.setText('Addon Purchased!');
    } else if (this.order.adhocs.length) {
      this.headerService.setText('Service Purchased!');
    } else {
      this.headerService.setText('Plan Purchased!');
    }

    sessionStorage.removeItem('currentCar');

    this.clearInterval = setTimeout( () => {
      this.goToDashboard();
    }, 10000); 
  }


  goToDashboard() {
    clearInterval(this.clearInterval);
    this.router.navigate(['/dashboard/service']);
  }
}
