import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from 'app/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  selectedCar: any;
  selectedPlan: any;

  carMismatch: boolean;
  carIdentified: boolean;

  errors: any;

  constructor(
    private router: Router,
    private checkoutService: CheckoutService
  ) {

    this.carMismatch = false;
    this.carIdentified = false;

    this.errors = {
      car: false,
      plan: false
    };

  }

  ngOnInit() {
    this.refreshCarAndPlans();

  }

  refreshCarAndPlans() {
    let car = sessionStorage.getItem('currentCar'),
      plan = sessionStorage.getItem('selectedPlan');

    if (!car || car == "null" || !car.length) {
      this.errors.car = true;
    } else {
      this.selectedCar = JSON.parse(car);
    }

    if (!plan || plan == "null" || !plan.length) {
      this.errors.plan = true;
    } else {
      this.selectedPlan = JSON.parse(plan);
    }
  }

  changeCar() {

    sessionStorage.setItem('currentCar', null);
    this.router.navigate(['/dashboard']);
  }

  changePlan() {

    sessionStorage.setItem('selectedPlan', null);
    this.router.navigate(['/dashboard']);
  }

  ionViewWillEnter() {
    console.log('Entered Checkout View');
    this.refreshCarAndPlans();
  }

  payNow() {
    this.checkoutService.createOrder(this.selectedPlan.price).subscribe((res: any) => {
      if (res.success) {
        let orderId = res.data.id;

        console.log('Order Created', orderId, res.data);
        this.checkoutService.tryPayment(orderId, res.data.amount);

      } else {
        console.log('Error creating order', res.errorMsg, res.error);
      }
    })
  }

  verifyCar(carDetails) {
    this.carIdentified = true;
    this.carMismatch = carDetails.maker.toLowerCase().indexOf(this.selectedCar.maker.toLowerCase()) < 0 || carDetails.model.toLowerCase().indexOf(this.selectedCar.model.toLowerCase()) < 0;
  }

}
