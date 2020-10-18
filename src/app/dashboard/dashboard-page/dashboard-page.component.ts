import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { HeaderService } from 'app/header.service';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/login/login.service';
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
    private headerService: HeaderService,
    private loginService:LoginService,
    private userService:UserService
  ) {

    this.ready = false;
    this.payments = [];
   }

  context: string;

  selectedPlan: any;
  selectedCar: any;
  currentUser:any;

  ready:boolean;

  payments:any;

  ngOnInit() {
    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path || 'dashboard';
    });

    this.ready = false;
  }

  ionViewWillEnter() {
    //console.log('Entering View in Dashboard Page');

    this.currentUser = this.userService.getCurrentUser();

    this.selectedPlan = sessionStorage.getItem('selectedPlan') ? JSON.parse(sessionStorage.getItem('selectedPlan')) : null;
    this.selectedCar = this.carService.getCurrentCar();

    let isLoggedIn = this.userService.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate(['/signup/login']);
    }

    if (!this.selectedPlan && this.context === 'plan') {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (this.selectedCar && this.context === 'select-car') {

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

    switch(this.context) {
      case 'dashboard': {
        this.headerService.setText('Choose Your Plan');
        break;
      }
      case 'select-car': {
        this.headerService.setText('Car Details');
        break;
      }
      case 'plan': {
        this.headerService.setText(this.selectedPlan.name);
        break;
      }
      case 'service': {
        this.headerService.setText('Dashboard');

        this.loginService.getPayments(this.currentUser.phone).subscribe((res:any) => {
          if (res.success) {

            if (res.data.length) {
              this.payments = res.data;
            this.ready = true;
            } else {
              this.router.navigate(['/dashboard/select-car']);
              return;
            }

            // if (this.payments.length > 1) {
            //   this.payments = [this.payments[this.payments.length-1]];
            // }
          }
        })

        return;
      }
      default: this.router.navigate(['/dashboard']);

    }

    this.ready = true;
  }

  goToCheckout() {
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
    this.router.navigate(['/dashboard']);
  }

}
