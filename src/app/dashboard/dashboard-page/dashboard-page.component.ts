import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { HeaderService } from 'app/header.service';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private planService: PlanService,
    private headerService: HeaderService,
    private toastController: ToastController,
    private loginService: LoginService,
    private userService: UserService
  ) {

    this.ready = false;
    this.payments = [];
    this.selectedAddon = null;
    this.selectedPlan = null;
    this.selectedCar = null;
    this.includedAdhocs = [];
    this.includedAddons = [];
    this.currentSubscription = null;
  }

  context: string;

  selectedPlan: any;
  selectedCar: any;
  currentUser: any;
  selectedAddon: any;
  selectedAdhoc: any;
  includedAddons: any;
  includedAdhocs:any;
  currentSubscription:any;

  ready: boolean;

  payments: any;

  ngOnInit() {
    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path || 'dashboard';
    });



    this.ready = false;
  }

  ionViewWillEnter() {
    //console.log('Entering View in Dashboard Page');

    this.currentUser = this.userService.getCurrentUser();

    this.selectedPlan = this.planService.getSelectedPlan();
    this.selectedCar = this.carService.getCurrentCar();

    let adhocs = this.planService.getIncludedAdhocs();
    this.selectedAdhoc = adhocs[adhocs.length-1];

    this.currentSubscription = this.planService.getCurrentSubscription();

    let isLoggedIn = this.userService.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate(['/signup/login']);
    }

    if (!this.selectedPlan && this.context === 'plan') {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (this.selectedCar && this.context === 'select-car') {
      this.router.navigate(['/dashboard']);
      return;
    }

    // if (this.selectedCar && this.context === 'select-car') {
    //   this.router.navigate(['/dashboard']);
    //   return;
    // }

    if (!this.selectedCar && this.context === 'dashboard') {
      this.router.navigate(['/dashboard/select-car']);
      return;
    }

    this.includedAddons = this.planService.getIncludedAddons();
    this.includedAdhocs = this.planService.getIncludedAdhocs();

    this.selectedAddon = this.includedAddons[this.includedAddons.length -1];

    switch (this.context) {
      case 'dashboard': {
        this.headerService.setText('Choose Your Plan');
        break;
      }
      case 'select-car': {
        this.headerService.setText('Car Details');
        break;
      }
      case 'plan': {
        this.headerService.setText(this.selectedPlan.name + ' Plan');
        break;
      }
      case 'adhoc': {
        this.headerService.setText(this.selectedAdhoc.name + ' Service');
        break;
      }
      case 'addon': {
        this.headerService.setText(this.selectedAddon.name + ' Addon');
        break;
      }
      case 'service': {
        this.headerService.setView('service', {});

        let payment = sessionStorage.getItem('currentPayments');

        // if (payment && payment != "null" && payment != "[]") {
        //   payment = JSON.parse(payment);
        //   this.payments = payment;
        //   this.ready = true;
        // } else {
        this.loginService.getPayments(this.currentUser.phone).subscribe((res: any) => {
          if (res.success) {
            this.payments = res.data ? res.data : [];

            if (this.payments.length) {
              sessionStorage.setItem('allPayments', JSON.stringify(this.payments));
              //this.payments = this.parsePayments(this.payments);
            }
            sessionStorage.setItem('currentPayments', JSON.stringify(this.payments));
            this.ready = true;

          }
        })
        //}
        return;
      }
      default: this.router.navigate(['/dashboard']);

    }

    this.ready = true;
  }

  onAddonSelect(addon) {
    //this.presentToast('Please select a Plan');
    if (this.includedAddons.some((a) => a.name == addon.name)) {
      this.planService.excludeAddon(addon);
      this.includedAddons = this.planService.getIncludedAddons();
    } else {
      this.planService.includeAddon(addon);
      this.includedAddons = this.planService.getIncludedAddons();
    }
  }

  setDateForAdhoc(date) {
    this.selectedAdhoc.startDate = date;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  parsePayments(payments) {
    let data = [];
    let p, f;
    for (let i = 0; i < payments.length; i++) {
      p = payments[i];
      f = data.filter((m) => m.regNo == p.car.regNo);
      if (f.length) {
        data[data.indexOf(f[0])].plans.push({
          startDate: p.startDate,
          expiresOn: p.expiresOn,
          planName: p.plan.name
        });
      } else {
        data.push({
          regNo: p.car.regNo,
          plans: [{
            startDate: p.startDate,
            expiresOn: p.expiresOn,
            planName: p.plan.name
          }]
        });
      }
    }

    let finalData = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].plans.length > 1) {

        let first, second, primary;
        primary = payments.filter((d) => data[i].regNo == d.car.regNo && data[i].plans[0].startDate == d.startDate)[0];

        for (let j = 0; j < data[i].plans.length - 1; j++) {

          first = payments.filter((d) => data[i].regNo == d.car.regNo && data[i].plans[j].startDate == d.startDate)[0];
          second = payments.filter((d) => data[i].regNo == d.car.regNo && data[i].plans[j + 1].startDate == d.startDate)[0];

          if (first.plan.name == second.plan.name) {
            primary.expiresOn = second.expiresOn;
          } else {
            primary.nextPlan = {
              ...second
            };
          }
        }

        finalData.push(primary);

      } else {
        finalData.push(payments.filter((d) => data[i].regNo == d.car.regNo && data[i].plans[0].startDate == d.startDate)[0]);
      }
    }

    return finalData;
  }

  goToCheckout() {
    sessionStorage.setItem('currentAdhoc', JSON.stringify(this.selectedAdhoc));
    sessionStorage.setItem('currentAddon', JSON.stringify(this.selectedAddon));

    this.router.navigate(['/dashboard/checkout']);
  }

  resetCar() {
    this.carService.clear();

    this.router.navigate(['/dashboard/select-car']);

  }

  goToDashboard(carData?) {

    if (carData) {
      this.carService.changeCar(carData);
    }

    this.planService.clear();
    this.planService.clearAdhocs();
    this.planService.clearAdhocs();
    this.router.navigate(['/dashboard']);
  }

}
