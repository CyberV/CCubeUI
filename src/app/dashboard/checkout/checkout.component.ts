import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutService } from 'app/services/checkout.service';
import { CarService } from 'app/services/car.service';
import { ModalController } from '@ionic/angular';
import { CheckoutConfirmationComponent } from 'app/common/checkout-confirmation/checkout-confirmation.component';
import { HeaderService } from 'app/header.service';
import { UserService } from 'app/services/user.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

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
  context:string;
  ready: boolean;
  retryAddon:boolean;
  updatedCarDetails:any;
  resetCarForm:boolean;


  page: string;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private carService: CarService,
    private userService:UserService,
    private modalController: ModalController,
    private headerService:HeaderService,
    private checkoutService: CheckoutService
  ) {

    this.carMismatch = false;
    this.carIdentified = false;
    this.page = '1';
    this.retryAddon = false;
    this.updatedCarDetails = {};
    this.resetCarForm = true;

    this.errors = {
      car: false,
      plan: false
    };

    this.ready = false;
  }

  ngOnInit() {
    this.refreshCarAndPlans();

    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path.toString().replace("checkout/","") ;
    })

    this.retryAddon = false;

  }

  updatePlan() {

    this.carService.changeCar(this.updatedCarDetails);
    this.router.navigate(["/dashboard/plan"]);

  }

  confirmCheckout() {
    this.router.navigate(['/dashboard/checkout/confirm']);
  }

  async showConfirmation() {
    let payload = {
      userName: this.userService.getCurrentUser().name,
      car: this.selectedCar,
      plan: this.selectedPlan    
    };
    const modal = await this.modalController.create({
      component: CheckoutConfirmationComponent,
      cssClass: 'checkout-confirmation-modal',
      componentProps: { 
        details: payload,
        bodyType: 'sedan',
        showClose: true
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data:any)=> {

      if (data && data.data &&  data.data.amount) {
        this.payNow();
      }

      // if (data && data.data) {
      //   let fltrdPlans = this.currentPlans.plans.filter( (plan) => plan.name.toLowerCase() == data.data.planName.toLowerCase());

      //   if (fltrdPlans && fltrdPlans.length) {
      //     this.buyPlan( {
      //       plan: fltrdPlans[0]
      //     });
      //   }
      // }

    });
    
  }

  refreshCarAndPlans() {


    let car = this.carService.getCurrentCar();
    
    
    if (car) {
      this.selectedCar = car;
    } else {
      this.errors.car = true;
    }

    let plan = sessionStorage.getItem('selectedPlan');

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

    this.refreshCarAndPlans();

    this.checkoutService.events().subscribe( (evt) => {
      if (evt.success) {
        // alert('Payment Successful');
        console.log(evt);
        this.router.navigate(['/dashboard/thanks']);
      }
    });

    switch(this.context) {
      case 'checkout': {
        this.headerService.setText('Your Selected Plan');
        break;
      }
      case 'confirm': {
        this.headerService.setView('checkout', { amount: this.selectedPlan.price });
        break;
      }
      default: this.router.navigate(['/dashboard']);

    }

    this.ready = true;

    setTimeout(()=> {
      this.retryAddon = true;
    }, 200);
  }

  payNow() {
    this.checkoutService.createOrder(this.selectedPlan.price).subscribe((res: any) => {
      if (res.success) {
        let orderId = res.data.id;
        let order = res.data;

        console.log('Order Created', orderId, res.data);
        this.checkoutService.tryPayment(order, res.data.amount);

      } else {
        console.log('Error creating order', res.errorMsg, res.error);
      }
    })
  }

  verifyCar(carDetails) {
    this.carIdentified = true;
    this.carMismatch = carDetails.maker.toLowerCase().indexOf(this.selectedCar.maker.toLowerCase()) < 0 || carDetails.model.toLowerCase().indexOf(this.selectedCar.model.toLowerCase()) < 0;
    this.updatedCarDetails = carDetails;
  }

}
