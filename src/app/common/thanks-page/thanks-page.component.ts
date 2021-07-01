import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'app/header.service';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { PlanService } from 'app/services/plan.service';
import { LoginService } from 'app/login/login.service';

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
    private loginService:LoginService,
    private carService:CarService
    ) { }

  public context: string;
  clearInterval:any;

  payment:any;
  order:any

  receiptId:string;

  get startDate()  {
     let st = this.payment ?  this.payment.plan ? new Date(this.payment.startDate || new DataCue()).toDateString() :  new Date(this.payment.startDate || this.payment.paymentDate).toDateString() : new Date().toDateString();
    return st != 'Invalid Date' ? st : new Date().toDateString();
  }

  ngOnInit() {

    this.context = "thanks";
    this.payment = null;
    this.receiptId = "";
  }

  ionViewWillEnter() {
    this.payment = JSON.parse(sessionStorage.getItem('currentPayment'));
    this.order=  this.planService.getCurrentOrder();

    this.receiptId = (+(new Date())).toString().substr(3,4);
    
    this.loginService.refreshUser(this.payment.phone);

    if (this.order.addons.length) {
      this.headerService.setText('Addon Purchased!');
    } if (this.order.adhocs.length) {
      this.headerService.setText('Service Purchased!');
    } {
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
