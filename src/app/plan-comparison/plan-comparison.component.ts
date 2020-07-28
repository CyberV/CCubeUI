import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRefService } from 'app/window-ref.service';
import { hash } from 'app/services/crypto.service';
import { CheckoutService } from 'app/services/checkout.service';

@Component({
  selector: 'plan-comparison',
  templateUrl: './plan-comparison.component.html',
  styleUrls: ['./plan-comparison.component.scss'],
})
export class PlanComparisonComponent implements OnInit {

  bodyType: string;


  constructor(
    private router: Router,
    private winRef: WindowRefService,
    private checkoutService: CheckoutService
  ) {


  }

  ionViewWillEnter() {
    let state = null;

    if (this.router.getCurrentNavigation()) {
      state = this.router.getCurrentNavigation().extras.state;
    }

    if (state) {
      sessionStorage.setItem('currentCar', JSON.stringify(state));
    } else if (sessionStorage.getItem('currentCar')) {
      state = JSON.parse(sessionStorage.getItem('currentCar'));
    }

    this.bodyType = state ? state.bodyType : '';
  }

  buyPlan(data) {
    console.log('Buying Plan', data);

    this.checkoutService.createOrder(data.amount).subscribe((res: any) => {
      if (res.success) {
        let orderId = res.data.id;

        console.log('Order Created', orderId, res.data);
        this.checkoutService.tryPayment(orderId, res.data.amount);

      } else {
        console.log('Error creating order', res.errorMsg, res.error);
      }
    })
   

  }


  ngOnInit() {

  }

}
