import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
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
import { AddonDetailsComponent } from 'app/common/addon-details/addon-details.component';
import { CheckoutDetailsComponent } from 'app/common/cehckout-details/cehckout-details.component';
import { scrollElementToTop, scrollToBottom } from 'app/util/util';
import { CouponsListComponent } from 'app/common/coupons-list/coupons-list.component';
import { getConfigValue } from 'app/common/common.service';
import { SwitchComponent } from 'app/common/switch/switch.component';
import { ConfirmLocationComponent } from 'app/common/confirm-location/confirm-location.component';
import { AppComponent } from 'app/app.component';

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
  availableCoupons: any;

  //current Order
  order: any;


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
  blockedAddons: any;
  blockedAdhocs: any;
  cpnBackup: any;

  currentUser: any;
  currentLocation: any;
  officeTime: string;
  loading: boolean;
  forRenew: boolean;
  includedAddons: any;
  includedAdhocs: any;
  mode: any;

  isUnlisted: boolean;
  appliedCoupons: any;


  page: string;
  savedLocation: any;
  discount: any;
  timeSaved: boolean;

  isRcMissing: boolean;

  get orderPrice() {
    return this.detailsComp.first ? this.detailsComp.first.getOrderPrice() : 0;
  }

  get netPayable() {
    return this.detailsComp.first ? this.detailsComp.first.getTotalPayable() : 0;
  }

  get serviceTotal() {
    return this.detailsComp.first ? this.detailsComp.first.getServiceTotal() : 0;
  }

  @ViewChildren('detailsComp') detailsComp: QueryList<CheckoutDetailsComponent>;
  @ViewChildren('drawerCar') drawerCar: QueryList<AccordionComponent>;
  @ViewChildren('drawerLocation') drawerLocation: QueryList<AccordionComponent>;
  @ViewChildren('drawerTime') drawerTime: QueryList<AccordionComponent>;
  @ViewChildren('durationSwitch') durationSwitch: QueryList<SwitchComponent>;

  @ViewChildren('cpnList') cpnList: QueryList<CouponsListComponent>;


  @ViewChildren('confLoc') confLoc: QueryList<ConfirmLocationComponent>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarService,
    private userService: UserService,
    private toastController: ToastController,
    private modalController: ModalController,
    private planService: PlanService,
    private loginService: LoginService,
    private headerService: HeaderService,
    private checkoutService: CheckoutService,
    private thisApp: AppComponent
  ) {

    this.carMismatch = false;
    this.carIdentified = false;
    this.page = '1';
    this.isRcMissing = false;

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
    this.cpnBackup = null;
    this.blockedAddons = [];
    this.blockedAdhocs = [];
    this.availableCoupons = [];
    this.appliedCoupons = [];
    this.mode = {};
    this.timeSaved = false;
    this.isUnlisted = false;
    this.savedLocation = {
      houseNo: '',
      block: '',
      society: '',
      city: '',
      state: ''
    };

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
    this.discount = {};
    this.currentSociety = "";
  }

  applyDiscount(discountData) {

    let duration = this.mode.plan ? 
    this.selectedPlan.duration
    : this.mode.addon ? 
    this.includedAddons[0].duration
    : 'monthly';

    if (duration == 'quarterly' && discountData && discountData.coupon && discountData.coupon.code !=  getConfigValue('COUPON_QUARTERLY')) {
      this.presentToast('Plan changed to Monthly.');
      this.durationSwitch.first.setActivePlanDuration('monthly');
    }
    if (discountData.discount > 0 && discountData.discount != this.discount.discount && (this.discount.coupon ? discountData.coupon.code != this.discount.coupon.code : true)) {
      this.thisApp.presentAlert({
        title: 'Congratulations',
        body: 'You just saved Rs. ' + discountData.discount + ' on this Purchase!',
        disappearing: true
      });
    }

    this.discount = {
      discount: discountData.discount,
      coupon: discountData.coupon
    };
    if (discountData.coupon) {
      this.appliedCoupons = [discountData.coupon];
    } else {
      this.appliedCoupons = [];
    }
    this.loading = false;

  }

  async applyCoupon(coupon = this.planService.getAppliedCoupon()) {
    if (this.context == 'confirm') {
      return;
    }
    return new Promise((resolve) => {
      if (this.context == 'checkout' && !this.detailsComp.first) {
        resolve({});
      }

      //let total = this.context == 'checkout' && this.detailsComp.first ? this.detailsComp.first.getOrderPrice() : ;

      if (coupon && coupon.code && this.detailsComp.first && this.detailsComp.first.getServiceTotal() >= coupon.minCartValue) {
        this.appliedCoupons = coupon ? [coupon] : [];
        let dscnt = 0;
        if (coupon.unit == 'percent') {
          dscnt = Math.floor(this.detailsComp.first.getOrderPrice() * (coupon.value / 100));
        } else {
          dscnt = coupon.value;
        }
        this.discount = {
          discount: dscnt,
          coupon: coupon
        };

        this.planService.setAppliedCoupon(coupon);
        resolve(this.discount);
      } else {
        this.presentToast('Coupon Removed!')
        this.onRemoveCoupon();
        resolve();
      }
    })

  }

  currentSociety: string;

  ngOnInit() {
    //this.refreshCarAndPlans();

    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path.toString().replace("checkout/", "");
    })

    this.retryAddon = false;

    let allSubs = this.planService.getAllSubscriptions();

    if (allSubs && allSubs.length) {
      this.savedLocation = JSON.parse(JSON.stringify(allSubs[0].payments[0].location.society ? allSubs[0].payments[0].location : allSubs[0].payments[0].location.location));
    }

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

    if (this.appliedCoupons.length && this.appliedCoupons[0].validFor == 'society') {
      this.confLoc.first.showCouponAlert();
    }

    if (this.mode.plan) {


      this.planService.changePlanForCar(this.selectedPlan.name, this.selectedCar);
      this.router.navigate(["/dashboard/plan"]);
    } else if (this.mode.adhoc) {
      this.planService.refreshAdhocs();
      this.router.navigate(["/dashboard/adhoc"]);
    }

  }

  async confirmCheckout() {

    await this.generateOrder();
    let bypassDetails = this.forRenew;

    let sub = this.planService.getCurrentSubscription();

    if (!bypassDetails) {
      bypassDetails = !this.mode.plan && this.mode.addon
    }

    if (!bypassDetails && sub) {
      bypassDetails = sub.carRegNo == this.selectedCar.regNo;
    }
    if (bypassDetails) {
      this.showConfirmation();
    } else {
      this.router.navigate(['/dashboard/checkout/confirm']);
    }
  }

  async showConfirmation() {
    await this.generateOrder();
    this.currentUser = this.userService.getCurrentUser();
    let order = this.planService.getCurrentOrder();
    let allPayments = JSON.parse(sessionStorage.getItem('allPayments'));
    let showPayLater = false;
    if (this.mode.plan) {
      this.planService.includeComplimentaryAdhocWithCode('FBW');
    }
    let carAlreadyActive = false;
    if (this.mode.plan && !(this.forRenew || this.selectedPlan.forUpgrade)) {


      if (allPayments && allPayments.length) {
        let cars =allPayments.filter((p) => { return p.car.regNo.toLowerCase() == order.car.regNo.toLowerCase() && !p.isAdhoc });
        carAlreadyActive = cars.length > 0;
        showPayLater = cars.length == 0 && this.selectedPlan.duration == 'monthly';

        //allPayments.map((s) => s.car.regNo.toLowerCase()).indexOf(order.car.regNo.toLowerCase()) > -1;
      }
      else {
        showPayLater = true;
      }
    } else {

    }

    let payload = {
      userName: this.currentUser.name,
      car: order.car,
      plan: order.plan,
      mode: this.mode,
      addons: order.addons,
      adhocs: order.adhocs,
      location: this.currentLocation && this.currentLocation.society && this.currentLocation.society.length ? this.currentLocation : order.location,
      discount: order.discount,
      showPayLater,
      bonus: order.bonus,
      info: order.info,
      total: order.total,
      serviceTotal: order.serviceTotal,
      newCarDiscount: order.newCarDiscount,
      carAlreadyActive: carAlreadyActive,
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

    modal.onDidDismiss().then(async (data: any) => {

      if (data && data.data && data.data.isUnlisted) {
        this.loginService.addLead({
          phone: this.currentUser.phone,
          name: this.currentUser.name,
          remarks: JSON.stringify({
            city: this.currentUser.city,
            plan: this.selectedPlan,
            adhocs: this.includedAdhocs,
            addons: this.includedAddons
          })
        }).subscribe((data: any) => {
          if (data.success) {
            this.presentToast("Interest Received. We will get back to you!")
          }
        })
        return;
      } else {

        if (data && data.data && data.data.amount) {
          await this.generateOrder(data.data.payLater);
          if (data.data.payLater) {
            this.payLater();
          } else {
            this.payNow();
          }
        
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

  async onAdhocSelected(adhoc, bypass = false) {
    if (!bypass)
      bypass = this.includedAdhocs.some((a) => a.name == adhoc.name);
    if (!bypass && adhoc.isAdhoc) {
      this.openAddon(adhoc, this.includedAdhocs.some((a) => a.name == adhoc.name));
    } else {
      this.includedAdhocs = this.includedAdhocs.some((a) => a.name == adhoc.name) ? this.planService.excludeAdhoc(adhoc) : this.planService.includeAdhoc(adhoc);
      await this.handleDurationToggle();
    }
  }

  async onAddonSelected(addon, bypass = false) {
    if (!bypass)
      bypass = this.includedAddons.some((a) => a.name == addon.name);
    if (!bypass && addon.isAdhoc) {
      this.openAddon(addon, this.includedAddons.some((a) => a.name == addon.name));
    } else {
      this.includedAddons = this.includedAddons.some((a) => a.name == addon.name) ? this.planService.excludeAddon(addon) : this.planService.includeAddon(addon);
      await this.refreshCarAndPlans();
    }
  }

  async handleDurationToggle() {
    this.refreshCarAndPlans();
      setTimeout(()=> {
        this.refreshCarAndPlans();
      }, 200);
  }

  async refreshCarAndPlans() {
    this.currentUser = this.userService.getCurrentUser();
    let loc: any = sessionStorage.getItem('userLocation');

    if (loc && loc != 'null') {
      loc = JSON.parse(loc);

      this.currentLocation = loc.society ? loc : loc.location;
      this.savedLocation = this.currentLocation;
    }

    let car = this.carService.getCurrentCar();

    if (car && car.isRcMissing) {
      this.isRcMissing = true;
    }


    this.includedAddons = this.planService.getIncludedAddons();
    this.includedAdhocs = this.planService.getIncludedAdhocs();

    let sub = this.planService.getCurrentSubscription();

    if (sub && sub.addons && sub.car.regNo.toLowerCase() == car.regNo.toLowerCase()) {
      this.blockedAddons = sub.addons.map((a) => a.addon);
    }

    if (sub && sub.adhocs && sub.car.regNo.toLowerCase() == car.regNo.toLowerCase()) {
      this.blockedAdhocs = sub.adhocs.map((a) => a.addon);
    }

    if (this.includedAddons && this.includedAddons.length) {
      this.selectedAddon = this.includedAddons[this.includedAddons.length - 1];
    }

    if (this.includedAdhocs && this.includedAdhocs.length) {
      this.selectedAdhoc = this.includedAdhocs[this.includedAdhocs.length - 1];
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

      if (this.selectedPlan.code == 'DLX') {
        this.planService.clearAddons();
        this.includedAddons = [];
      }

      this.forRenew = !!this.selectedPlan.forRenew;
    }

    let appliedCoupon = this.planService.getAppliedCoupon();
    let qrt = getConfigValue('COUPON_QUARTERLY');
    if (this.mode.plan && !this.selectedPlan.forUpgrade && this.planService.getPlanDuration() == 'quarterly' && this.cpnList.first) {

      if (appliedCoupon && appliedCoupon.code != qrt) {
        this.cpnBackup = JSON.parse(JSON.stringify(appliedCoupon));
      }
      setTimeout(() => {
        this.loading = true;
        this.cpnList.first.tryCoupon(qrt);
      }, 10);

      //}

    } else {


      if (appliedCoupon && appliedCoupon.code == qrt && this.planService.getPlanDuration() == 'monthly') {
        this.onRemoveCoupon();
        if (this.cpnBackup) {
          await this.applyCoupon(this.cpnBackup)
        }
      } else if (appliedCoupon && appliedCoupon.code) {
        await this.applyCoupon(appliedCoupon);
      }
    }



    await this.generateOrder();


  }

  retryCoupons() {
    sessionStorage.setItem('retryCoupons', 'true');
    this.router.navigate(['/dashboard/checkout']);

  }

  findCouponComponent() {
    setTimeout(() => {
      if (this.cpnList.first) {
        console.log('Found Coupon List. Opening');

        this.cpnList.first.openCoupons();
        setTimeout(() => {
          console.log('Found Coupon List. Opening');

          let cont = document.getElementsByClassName('container');
          cont[cont.length - 1].scrollTop = 500;
        }, 200);
      } else {
        console.log('Retrying to find');
        this.findCouponComponent();
      }
    }, 100);
  }

  handleLocationOpen(d) {
    console.log(d);
    if (d) {
      this.confLoc.first.handleSocietyData();
    }

  }

  async openAddon(addon, added = false) {
    let bookedTime = false;

    if (this.includedAdhocs.length) {
      let found = this.includedAdhocs.filter((adn) => adn.code == addon.code);

      if (found.length) {
        found = found[0];
        if (found.scheduledDate) {
          bookedTime = found.scheduledDate;
          addon.scheduledDate = bookedTime;
        }
      }
    }

    const modal = await this.modalController.create({
      component: AddonDetailsComponent,
      cssClass: 'plans-table-modal',
      componentProps: {
        addon: addon.isAdhoc ? null : addon,
        adhoc: addon.isAdhoc ? addon : null,
        purchased: (addon.isAdhoc ? this.includedAdhocs : this.includedAddons).some((a) => a.name == addon.name),
        showClose: true,
        // bookedTime
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data: any) => {
      console.log('Received Data from aDdon modal on close', data);
      if (data && data.data && data.data.addon) {
        addon.isAdhoc ? this.onAdhocSelected(data.data.addon, true) : this.onAddonSelected(data.data.addon, true);
      } else {
        this.includedAdhocs = this.planService.getIncludedAdhocs();
        this.includedAddons = this.planService.getIncludedAddons();
      }

    });
  }

  resetCar() {
    this.carService.clear();
    //this.isCarSelected = false;
    this.router.navigate(['/dashboard/select-car']);
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
      this.currentLocation = locationData.location.society ? locationData.location : locationData.location.location;
      this.isUnlisted = locationData.isUnlisted;
      sessionStorage.setItem('userLocation', JSON.stringify(locationData));

      setTimeout(()=> {
        console.log('Closing Location Drawer from Save Location');
        this.drawerLocation.first ? this.drawerLocation.first.toggle(false) : '';
        this.step3Ready = true;
        this.completeVerification(true);
      }, 100);

    } else {
      this.step3Ready = false;
      this.currentLocation.society = '';
      this.verificationComplete = false;
    }

    // if (this.savedLocation && this.savedLocation.houseNo.length) {
    //   setTimeout(() => {
    //     this.step3Ready = true;


    //       setTimeout(() => {

    //         this.drawerLocation.first.toggle(this.verificationComplete ? false : true);
    //         //this.drawerTime.first.toggle();


    //       }, 500);

    //   }, 200);
    // } else {
    //   setTimeout(() => {
    //     this.step3Ready = true;


    //     setTimeout(() => {
    //       this.drawerLocation.first.toggle(true);
    //       //this.drawerTime.first.toggle();
    //     }, 500);
    //   }, 200);
    // }


  }

  changePlan(newPlan) {

    this.selectedPlan = newPlan;
    this.refreshCarAndPlans();
  }

  ionViewWillLeave() {
    this.checkoutService.events().unsubscribe();
  }

  async ngAfterViewInit() {
    await this.refreshCarAndPlans();
  }

  completeVerification(fromTime = false, saveTime = false) {

    if (saveTime) {
      this.timeSaved = true;
    }

    let l= this.currentLocation.location && this.currentLocation.location.society;

    let hasLocation = this.currentLocation && (this.currentLocation.society || (l ? l.length : ''));


    if (hasLocation && this.carIdentified && !this.carMismatch) {
      this.verificationComplete = true;
    } else {
      this.verificationComplete = false;
    }

    if (fromTime) {
      //this.drawerTime.first.toggle();



    }

    // setTimeout(()=>{
    //   //this.showConfirmation();
    // }, 1000);
  }

  savedSociety: any;

  async ionViewWillEnter() {

    this.loginService.refreshUser(this.currentUser.phone).then((u) => {
      this.currentUser = this.userService.getCurrentUser();
    })

    let soc = localStorage.getItem('selectedSociety');

    this.savedSociety = soc && soc != "null" ? JSON.parse(soc) : null;

    this.refreshCarAndPlans();

    if (this.context === 'confirm') {
      let car = this.carService.getCurrentCar();

      if (car) {
        this.selectedCar = car;
        if (this.selectedCar.regNo.length) {
          this.carIdentified = true;
          this.carMismatch = false;
          this.step2Ready = true;


          console.log('Opening Location Drawer from ionViewEnter');

          if (this.savedLocation && this.savedLocation.houseNo.length) {
            this.completeVerification(true);
            setTimeout(() => {
              this.drawerLocation.first.toggle(true);
            }, 500);
          } else {
            setTimeout(() => {
              this.drawerLocation.first.toggle(true);
            }, 500);
          }
        } else {
          this.carIdentified = false;
          this.carMismatch = false;
          this.step2Ready = false;
          this.step3Ready = false;
          setTimeout(() => {
            this.drawerCar.first.toggle(true);
          }, 1000);

        }
      } else {
        this.errors.car = true;
        this.router.navigate(['/dashboard/select-car']);
      }
    }

    this.checkoutService.events().subscribe(async (evt) => {
      try {
        if (evt.success) {
          let order = this.planService.getCurrentOrder();
          let updatedPlan = this.planService.getSelectedPlan();
          let payload: any = {
            phone: this.currentUser.phone,
            plan: updatedPlan,
            isRcMissing: this.isRcMissing,
            isPostpaid: order.payLater,
            coupon: (order.discount && order.discount.coupon) ? order.discount.coupon : null,
            car: this.selectedCar,
            addons: this.includedAddons,
            adhocs: this.includedAdhocs,
            bonusApplied: order.bonus,
            location: this.currentLocation,
            officeTime: this.officeTime,
            startDate: new Date().toDateString(),
            order: order,
            lastDate: updatedPlan && updatedPlan.lastDate
          };

          if (this.mode.plan) {

            if (this.forRenew) {
              payload.forRenew = true;
              payload.lastDate = updatedPlan.lastDate;
              this.loginService.renewPayment(payload).subscribe((d: any) => {
                console.log('Renew payment response', d);
                sessionStorage.removeItem('complimentary');
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
                sessionStorage.removeItem('complimentary');
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

          this.planService.clearAll();

        } else {
          alert(
            'Please try again!'
          );
        }
      } catch (er) {
        alert('Error in Checkout Subscribe: ' + JSON.stringify(er)
        );
      }

      this.planService.setAppliedCoupon(null);
    });

    switch (this.context) {
      case 'checkout': {
        this.headerService.setText('Your Selected ' + (this.mode.plan ? 'Plan' : (this.mode.adhoc ? 'Service' : 'Addon')));
        this.loading = true;
        this.currentSociety = (this.savedSociety && !this.savedSociety.isUnlisted) ? this.savedSociety.society : (this.currentLocation ? this.currentLocation.society : "Your Society");
        this.loginService.getCouponsForUser(this.currentSociety, this.selectedCar.bodyType).subscribe(async (res: any) => {
          this.availableCoupons = res.success ? res.data : [];

          let qrt = getConfigValue('COUPON_QUARTERLY');
          if (qrt && this.selectedPlan && !this.selectedPlan.forUpgrade) {
            let found = this.availableCoupons.filter((c) => c.code == 'CCUBE-QRTRLY');

            if (found.length && this.planService.getPlanDuration() == 'quarterly') {
              found = found[0];
              await this.applyCoupon(found);
            }
          }

          if (this.appliedCoupons.length) {
            await this.applyCoupon();
          }

          this.loading = false;

          let rc = sessionStorage.getItem('retryCoupons');
          if (rc && rc == 'true') {
            this.findCouponComponent();
            sessionStorage.removeItem('retryCoupons');
          }
        })
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

  goToAddons() {
    console.log('scroll ti bopptom');
    scrollToBottom();
  }

  onRemoveCoupon() {
    let duration = this.planService.getPlanDuration();
    if (duration == 'quarterly' && this.appliedCoupons.length) {
      this.presentToast('Plan changed to Monthly.');
      this.planService.setAppliedCoupon(null);
      this.discount = {};
      this.appliedCoupons = [];
      this.durationSwitch.first.setActivePlanDuration('monthly');
      return;
    }
    this.planService.setAppliedCoupon(null);
    this.discount = {};
    this.appliedCoupons = [];
  }

  async generateOrder(payLater = false) {

    let plan = !!this.selectedPlan;
    let addon = !!(this.includedAddons && this.includedAddons.length);
    let adhoc = !!(this.includedAdhocs && this.includedAdhocs.length);

    this.mode = {
      plan,
      addon,
      adhoc
    };

    if (this.context == 'confirm') {
      this.order = await this.planService.getCurrentOrder();
      this.order.isRcMissing = this.isRcMissing;
      this.order.car.regNo = this.selectedCar.regNo;
      this.order.payLater = payLater;
      this.order = await this.planService.lockCurrentOrder(this.order);

    } else {
      if (this.appliedCoupons.length) {
        await this.applyCoupon();
      }

      let order = {
        addons: this.includedAddons,
        adhocs: this.includedAdhocs,
        plan: this.planService.getSelectedPlan(),
        location: this.savedLocation,
        payLater: payLater,
        bonus: this.currentUser.referralBonusPending,
        serviceTotal: this.serviceTotal,
        total: this.netPayable,
        discount: this.discount,
        newCarDiscount: this.detailsComp.first ? this.detailsComp.first.getNewCarDiscount() : 0,
        car: this.selectedCar
      };

      this.order = await this.planService.lockCurrentOrder(order);
    }


  }

  payNow() {
    this.loading = true;
    this.order = this.planService.getCurrentOrder();
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

  payLater() {
    this.loading = true;
    this.order = this.planService.getCurrentOrder();
    this.checkoutService.payLater(this.order);
  }

  verifyCar(carDetails) {

    this.isRcMissing = false;
    if (!carDetails.fuelType) {
      // Car API Failed. fallback to RC document
      this.isRcMissing = true;
      this.carIdentified = true;
      this.carMismatch = false;
      let regNo = carDetails.regNo;
      let xx = {
        ...this.selectedCar,
        isRcMissing: this.isRcMissing,
        regNo
      }

      this.carService.changeCar(xx);
      this.selectedCar = this.carService.getCurrentCar();


      setTimeout(() => {

        this.step2Ready = !this.carMismatch;
        this.completeVerification();
        this.drawerCar.first.toggle(false);

        setTimeout(()=> {

            this.drawerLocation.first.toggle(true);
          
        }, 200);
      }, 100);

      return;

    }
    this.carIdentified = true;
    this.carMismatch = carDetails.maker.toLowerCase().indexOf(this.selectedCar.maker.toLowerCase()) < 0 || carDetails.model.toLowerCase().indexOf(this.selectedCar.model.toLowerCase()) < 0;

    setTimeout(() => {
      this.step2Ready = !this.carMismatch;
      if (!this.carMismatch) {
      this.drawerCar.first.toggle(false);
      }
      setTimeout(()=> {
        if (!this.carMismatch) {
          this.drawerLocation.first.toggle(true);
        }
      }, 500);

    }, 1000);

    this.updatedCarDetails = carDetails;

    if (!this.carMismatch) {
      this.carService.changeCar(this.updatedCarDetails);
      this.selectedCar = this.carService.getCurrentCar();

    }

    this.completeVerification();
  }

}
