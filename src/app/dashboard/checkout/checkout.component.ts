import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutService } from 'app/services/checkout.service';
import { CarService } from 'app/services/car.service';
import { ModalController, ToastController } from '@ionic/angular';
import { CheckoutConfirmationComponent } from 'app/common/checkout-confirmation/checkout-confirmation.component';
import { HeaderService } from 'app/header.service';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';
import { AccordionComponent } from 'app/common/accordion/accordion.component';

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

  //current Order
  order:any;


  errors: any;
  context: string;
  ready: boolean;
  retryAddon: boolean;
  updatedCarDetails: any;
  resetCarForm: boolean;
  step2Ready: boolean;
  step3Ready: boolean;
  verificationComplete: boolean;
  selectedAddon: any;
  selectedAdhoc: any;

  currentUser: any;
  currentLocation: any;
  officeTime: string;
  loading: boolean;
  forRenew: boolean;
  includedAddons: any;
  includedAdhocs: any;
  mode:any;

  isUnlisted:boolean;


  page: string;

  @ViewChildren('drawerCar') drawerCar: QueryList<AccordionComponent>;
  @ViewChildren('drawerLocation') drawerLocation: QueryList<AccordionComponent>;
  @ViewChildren('drawerTime') drawerTime: QueryList<AccordionComponent>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarService,
    private userService: UserService,
    private toastController:ToastController,
    private modalController: ModalController,
    private planService: PlanService,
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
    this.forRenew = false;
    this.selectedCar = null;
    this.selectedAddon = null;
    this.selectedAdhoc = null;
    this.order = null;
    this.includedAddons = [];
    this.includedAdhocs = [];
    this.mode = {};
    this.isUnlisted = false;

    this.errors = {
      car: false,
      plan: false
    };

    this.currentUser = {};
    this.currentLocation = {};
    this.officeTime = "10:00 AM";

    this.ready = false;

    this.step2Ready = false;
    this.step3Ready = false;
  }

  ngOnInit() {
    //this.refreshCarAndPlans();

    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path.toString().replace("checkout/", "");
    })

    this.retryAddon = false;

  }

  backToDashboard() {
    this.router.navigate(['/dashboard/service']);
  }

  changeCar() {
    this.carService.clear();
    this.router.navigate(['/dashboard/select-car']);
  }

  updatePlan() {

    this.carService.changeCar(this.updatedCarDetails);
    this.selectedCar = this.carService.getCurrentCar();
    this.router.navigate(["/dashboard/plan"]);

  }

  confirmCheckout() {

    this.generateOrder();

    if (this.forRenew || (!this.mode.plan && (this.mode.addon || this.mode.adhoc))) {
      this.showConfirmation();
    } else {
      this.router.navigate(['/dashboard/checkout/confirm']);
    }
  }

  async showConfirmation() {
    this.currentUser = this.userService.getCurrentUser();
    let order = this.planService.getCurrentOrder();
    let payload = {
      userName: this.currentUser.name,
      car: order.car,
      plan: order.plan,
      mode: this.mode,
      addons: order.addons,
      adhocs: order.adhocs,
      info: order.info,
      total: order.total,
      isUnlisted: this.isUnlisted
    };
    const modal = await this.modalController.create({
      component: CheckoutConfirmationComponent,
      cssClass: 'checkout-confirmation-modal',
      componentProps: {
        details: payload,
        bodyType: payload.car.bodyType,
        showClose: true
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data: any) => {

      if (data.data.isUnlisted) {
        this.loginService.addLead({
          phone: this.currentUser.phone,
          name: this.currentUser.name,
          remarks : JSON.stringify({
            city: this.currentUser.city,
            plan: this.selectedPlan,
            adhocs: this.includedAdhocs,
            addons: this.includedAddons
          })
        }).subscribe((data:any) => {
          if (data._id) {
            this.presentToast("Interest Received. We will get back to you!")
          }
        })
        return;
      } else {

        if (data && data.data && data.data.amount) {
          this.generateOrder();
          this.payNow();
        }
      }

    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnChanges(changes) {

  }

  onAdhocSelected(adhoc) {
    this.includedAdhocs = this.includedAdhocs.some((a) => a.name == adhoc.name) ? this.planService.excludeAdhoc(adhoc) : this.planService.includeAdhoc(adhoc);
    this.refreshCarAndPlans();

  }

  onAddonSelected(addon) {
    this.includedAddons = this.includedAddons.some((a) => a.name == addon.name) ? this.planService.excludeAddon(addon) : this.planService.includeAddon(addon);
    this.refreshCarAndPlans();
  }

  refreshCarAndPlans() {
    this.currentUser = this.userService.getCurrentUser();
    let loc = sessionStorage.getItem('userLocation');

    if (loc && loc != 'null') {
      this.currentLocation = loc;
    }

    let car = this.carService.getCurrentCar();


    this.includedAddons = this.planService.getIncludedAddons();
    this.includedAdhocs = this.planService.getIncludedAdhocs();

    if (this.includedAddons && this.includedAddons.length) {
      this.selectedAddon = this.includedAddons[this.includedAddons.length -1];
    }

    if (this.includedAdhocs && this.includedAdhocs.length) {
      this.selectedAdhoc = this.includedAdhocs[this.includedAdhocs.length -1];
    }

    if (car) {
      this.selectedCar = car;
    }

    let plan = this.planService.getSelectedPlan();

    if (!plan) {
      this.errors.plan = true;
      this.selectedPlan = null;
    } else {
      this.selectedPlan = plan;

      this.forRenew = !!this.selectedPlan.forRenew;
    }

    this.generateOrder();


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
      this.currentLocation = locationData.location;
      this.isUnlisted = locationData.isUnlisted;
      sessionStorage.setItem('userLocation', JSON.stringify(locationData));
    }

    setTimeout(() => {
      this.step3Ready = true;
      this.drawerLocation.first.toggle();

      setTimeout(() => {
        this.drawerTime.first.toggle();
      }, 500);
    }, 200);

  }

  changePlan() {

    this.planService.clear();
    this.router.navigate(['/dashboard']);
  }

  ionViewWillLeave() {
    this.checkoutService.events().unsubscribe();
  }

  ngAfterViewInit() {
    this.refreshCarAndPlans();
  }

  completeVerification() {

    this.verificationComplete = true;
    this.drawerTime.first.toggle();

    // setTimeout(()=>{
    //   //this.showConfirmation();
    // }, 1000);
  }

  ionViewWillEnter() {

    this.refreshCarAndPlans();

    if (this.context === 'confirm') {
      let car = this.carService.getCurrentCar();

      if (car) {
        this.selectedCar = car;
        if (this.selectedCar.fuelType) {
          this.carIdentified = true;
          this.carMismatch = false;
          this.step2Ready = true;
          setTimeout(() => {
            this.drawerLocation.first.toggle();
          }, 1000);
        } else {
          setTimeout(() => {
            this.drawerCar.first.toggle();
          }, 1000);

        }
      } else {
        this.errors.car = true;
        this.router.navigate(['/dashboard/select-car']);
      }
    }

    this.checkoutService.events().subscribe((evt) => {
      if (evt.success) {
        let updatedPlan = this.planService.getSelectedPlan();
        let payload: any = {
          phone: this.currentUser.phone,
          plan: updatedPlan,
          car: this.selectedCar,
          addons: this.planService.getIncludedAddons(),
          adhocs: this.planService.getIncludedAdhocs(),
          location: this.currentLocation,
          officeTime: this.officeTime,
          startDate: +(new Date()),
          lastDate: updatedPlan && updatedPlan.lastDate
        };

        if (this.mode.plan) {

          if (this.forRenew) {
            payload.forRenew = true;
            payload.lastDate = updatedPlan.lastDate;
            this.loginService.renewPayment(payload).subscribe((d: any) => {
              console.log('Renew payment response', d);
              this.loading = false;
              if (d.success) {
                sessionStorage.setItem('currentPayment', JSON.stringify(payload));
                this.router.navigate(['/dashboard/thanks']);
              } else {
                alert(
                  'Please try again!'
                );
              }
  
            });

          } else {
            this.loginService.addPayment(payload).subscribe((d: any) => {
              console.log('add payment response', d);
              this.loading = false;
              if (d.success) {
                sessionStorage.setItem('currentPayment', JSON.stringify(d.data));
                this.router.navigate(['/dashboard/thanks']);
              } else {
                alert(
                  'Please try again!'
                );
              }
  
            });
          }

        } else {

          if (this.mode.addon) {

                      // Buy Addon
          this.loginService.addAddon(payload).subscribe((d: any) => {
            console.log('add addon response', d);
            this.loading = false;
            if (d.success) {
              //this.carService.changeAddon(d.data);
              sessionStorage.setItem('currentPayment', JSON.stringify(d.data));
              this.router.navigate(['/dashboard/thanks']);
            } else {
              alert(
                'Please try again!'
              );
            }

          });

          } else if (this.mode.adhoc) {

            
                      // Buy Adhoc
          this.loginService.addAdhoc(payload).subscribe((d: any) => {
            console.log('add addon response', d);
            this.loading = false;
            if (d.success) {
              sessionStorage.setItem('currentPayment', JSON.stringify(d.data));
              this.router.navigate(['/dashboard/thanks']);
            } else {
              alert(
                'Please try again!'
              );
            }

          });
          }

        }


      } else {
        alert(
          'Please try again!'
        );
      }
    });

    switch (this.context) {
      case 'checkout': {
        this.headerService.setText('Your Selected ' + (this.mode.plan ? 'Plan' : (this.mode.adhoc?  'Service' : 'Addon')));
        break;
      } 
      case 'confirm': {
        let order = this.planService.getCurrentOrder();
        this.headerService.setView('checkout', { amount: order.total });
        break;
      }
      default: this.router.navigate(['/dashboard']);

    }

    this.ready = true;

    setTimeout(() => {
      this.retryAddon = true;
    }, 200);
  }

  generateOrder() {
    let plan = !!this.selectedPlan;
    let addon = !!(this.includedAddons && this.includedAddons.length);
    let adhoc = !!(this.includedAdhocs && this.includedAdhocs.length);

    this.mode = {
      plan,
      addon,
      adhoc
    };

    let order = {
      addons: this.includedAddons,
      adhocs: this.includedAdhocs,
      plan: this.planService.getSelectedPlan(),
      car: this.selectedCar
    };

    this.order = this.planService.lockCurrentOrder(order);
  }

  payNow() {
    this.loading = true;
    this.checkoutService.createOrder(this.order.total).subscribe((res: any) => {
      if (res.success) {
        let orderId = res.data.id;
        let order = res.data;

        console.log('Order Created', orderId, res.data);
        this.checkoutService.tryPayment(order, res.data.amount);

      } else {
        this.loading = false;
        console.log('Error creating order', res.errorMsg, res.error);
      }
    });
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
