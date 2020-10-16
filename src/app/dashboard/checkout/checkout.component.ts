import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutService } from 'app/services/checkout.service';
import { CarService } from 'app/services/car.service';
import { ModalController } from '@ionic/angular';
import { CheckoutConfirmationComponent } from 'app/common/checkout-confirmation/checkout-confirmation.component';
import { HeaderService } from 'app/header.service';
import { UserService } from 'app/services/user.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { LoginService } from 'app/login/login.service';

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
  context: string;
  ready: boolean;
  retryAddon: boolean;
  updatedCarDetails: any;
  resetCarForm: boolean;
  step2Ready: boolean;
  step3Ready: boolean;
  verificationComplete: boolean;

  currentUser:any;
  currentLocation: any;
  officeTime:string;
  loading:boolean;


  page: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarService,
    private userService: UserService,
    private modalController: ModalController,
    private loginService: LoginService,
    private headerService: HeaderService,
    private checkoutService: CheckoutService
  ) {

    this.carMismatch = false;
    this.carIdentified = false;
    this.page = '1';
    this.retryAddon = false;
    this.loading = false;
    this.updatedCarDetails = {};
    this.resetCarForm = true;
    this.verificationComplete = false;

    this.errors = {
      car: false,
      plan: false
    };

    this.currentUser = {};
    this.currentLocation = {};
    this.officeTime = "";

    this.ready = false;

    this.step2Ready = false;
    this.step3Ready = false;
  }

  ngOnInit() {
    this.refreshCarAndPlans();

    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path.toString().replace("checkout/", "");
    })

    this.retryAddon = false;

  }

  updatePlan() {

    this.carService.changeCar(this.updatedCarDetails);
    this.selectedCar = this.carService.getCurrentCar();
    this.router.navigate(["/dashboard/plan"]);

  }

  confirmCheckout() {
    this.router.navigate(['/dashboard/checkout/confirm']);
  }

  async showConfirmation() {
    this.currentUser = this.userService.getCurrentUser();
    let payload = {
      userName: this.currentUser.name,
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

    modal.onDidDismiss().then((data: any) => {

      if (data && data.data && data.data.amount) {
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
      if (this.selectedCar.fuelType) {
        this.carIdentified = true;
        this.carMismatch = false;
        this.step2Ready = true;
      }
    } else {
      this.errors.car = true;
      this.router.navigate(['/dashboard/select-car']);
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

  resetCarNumber() {
    this.carIdentified = false;
    this.carMismatch = false;

    this.resetCarForm = false;

    setTimeout(() => {
      this.resetCarForm = true;
    }, 500);
  }

  saveLocation(locationData) {
    
    if (locationData) {
      this.currentLocation = locationData;
      sessionStorage.setItem('userLocation', JSON.stringify(locationData));
    }

    setTimeout(() => {
      this.step3Ready = true;
    }, 1000);

  }

  changePlan() {

    sessionStorage.setItem('selectedPlan', null);
    this.router.navigate(['/dashboard']);
  }

  ionViewWillEnter() {

    this.refreshCarAndPlans();

    this.checkoutService.events().subscribe((evt) => {
      if (evt.success) {
        let payload = {
          phone: this.currentUser.phone,
          plan: this.selectedPlan,
          car: this.selectedCar,
          location: this.currentLocation,
          officeTime: this.officeTime,
          startDate: +(new Date())
        };

        this.loginService.addPayment(payload).subscribe( (d:any) => {
          console.log('add payment response', d);
          if (d.success) {
            sessionStorage.setItem('currentPayment', JSON.stringify(payload));
            this.router.navigate(['/dashboard/thanks']);
          } else {

          }
          
        })
        
      } else {
          alert(
            'Please try again!'
          );
      }
    });

    switch (this.context) {
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

    setTimeout(() => {
      this.retryAddon = true;
    }, 200);
  }

  payNow() {
    this.loading = true;
    this.checkoutService.createOrder(this.selectedPlan.price).subscribe((res: any) => {
      if (res.success) {
        let orderId = res.data.id;
        let order = res.data;

        console.log('Order Created', orderId, res.data);
        this.checkoutService.tryPayment(order, res.data.amount);

      } else {
        this.loading = false;
        console.log('Error creating order', res.errorMsg, res.error);
      }
    })
  }

  verifyCar(carDetails) {

    if (!carDetails.maker) {
      // Car API Failed. fallback to RC document
      this.carIdentified = true;
      this.carMismatch = false;
      let regNo = carDetails.regNo;
      let xx = {
        ...this.selectedCar,
        regNo
      }
      
      this.carService.changeCar(xx);
      this.selectedCar = this.carService.getCurrentCar();


      setTimeout(() => {
        this.step2Ready = !this.carMismatch;
      }, 1000);

      return;

    }
    this.carIdentified = true;
    this.carMismatch = carDetails.maker.toLowerCase().indexOf(this.selectedCar.maker.toLowerCase()) < 0 || carDetails.model.toLowerCase().indexOf(this.selectedCar.model.toLowerCase()) < 0;

    setTimeout(() => {
      this.step2Ready = !this.carMismatch;
    }, 3000);

    this.updatedCarDetails = carDetails;

    if (!this.carMismatch) {
      this.carService.changeCar(this.updatedCarDetails);
      this.selectedCar = this.carService.getCurrentCar();
    }
  }

}
