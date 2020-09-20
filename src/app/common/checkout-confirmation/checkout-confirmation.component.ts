import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.scss'],
})
export class CheckoutConfirmationComponent implements OnInit {

  @Input() details:any;

  constructor(
    private modalController: ModalController
  ) {

    this.details = {};
   }

  ngOnInit() {}

  dismissAndPay() {
    this.modalController.dismiss({
      amount: 1000
    });
  }

}
