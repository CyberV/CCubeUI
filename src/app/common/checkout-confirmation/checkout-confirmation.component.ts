import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.scss'],
})
export class CheckoutConfirmationComponent implements OnInit {

  @Input() details:any;

  hasAddons:boolean;
  hasAdhocs:boolean;
  totalAmount:any;

  mode:any;

  constructor(
    private modalController: ModalController
  ) {

    this.details = {};
    this.hasAddons = false;
    this.hasAdhocs = false;
    this.totalAmount = 0;
    this.mode = null;
   }

  ngOnInit() {
    if (this.details) {
      this.hasAddons = !!(this.details.addons && this.details.addons.length);
      this.hasAdhocs = !!(this.details.adhocs && this.details.adhocs.length);
      this.totalAmount = this.details.total;
      this.mode = this.details.mode;
  }
  }

  ngOnChanges(changes) {
    if (changes.details && this.details) {
        this.hasAddons = !!(this.details.addons && this.details.addons.length);
        this.hasAdhocs = !!(this.details.adhocs && this.details.adhocs.length);
        this.totalAmount = this.details.total;
        this.mode = this.details.mode;
    }
  }

  dismissAndPay() {
    this.modalController.dismiss({
      amount: 1000
    });
  }

}
