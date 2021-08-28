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
  serviceTotal:number;
  address:string;

  showPayLater:boolean;

  mode:any;

  constructor(
    private modalController: ModalController
  ) {

    this.details = {};
    this.hasAddons = false;
    this.hasAdhocs = false;
    this.totalAmount = 0;
    this.serviceTotal = 0;
    this.showPayLater = false;
    this.mode = null;
   }

  ngOnInit() {
     
    if (this.details) {
      this.hasAddons = !!(this.details.addons && this.details.addons.length);
      this.hasAdhocs = !!(this.details.adhocs && this.details.adhocs.length);
      this.totalAmount = this.details.total;
      this.serviceTotal = this.details.serviceTotal || this.details.total;
      this.mode = this.details.mode;

      this.showPayLater = this.details.showPayLater ? this.details.showPayLater : false;

      
      if (this.details.location) {
        let loc = this.details.location;
        this.address = loc.houseNo + ", " + (loc.block ? loc.block + ", " : "") + loc.society + ", " + loc.city + ', ' + loc.state;
      }

  }
  }

  ngOnChanges(changes) {
     
    if ( this.details) {
        this.hasAddons = !!(this.details.addons && this.details.addons.length);
        this.hasAdhocs = !!(this.details.adhocs && this.details.adhocs.length);
        this.totalAmount = this.details.total;
        this.serviceTotal = this.details.serviceTotal || this.details.total;

        this.mode = this.details.mode;
        this.showPayLater = this.details.showPayLater ? this.details.showPayLater : false;

        if (this.details.location) {
          let loc = this.details.location;
          this.address = loc.houseNo + ", " + (loc.block ? loc.block + ", " : "") + loc.society + ", " + loc.city + ', ' + loc.state;
        }
      
    }
  }

  dismissAndPay() {
    this.modalController.dismiss({
      amount: 1000
    });
  }

  sendPayLater() {
    this.modalController.dismiss({
      amount: 1000,
      payLater: true
    });
  }

  dismissOnly() {
    this.modalController.dismiss({
      amount:-1,
      isUnlisted: true
    });
  }

}
