import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService
  ) {

    this.ready = false;
   }

  context: string;

  selectedPlan: any;
  selectedCar: any;

  ready:boolean;

  ngOnInit() {
    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path || 'dashboard';
    });

    this.ready = false;
  }

  ionViewWillEnter() {
    //console.log('Entering View in Dashboard Page');

    
    this.selectedPlan = sessionStorage.getItem('selectedPlan') ? JSON.parse(sessionStorage.getItem('selectedPlan')) : null;
    this.selectedCar = this.carService.getCurrentCar();

    if (!this.selectedPlan && this.context === 'plan') {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (!this.selectedCar && this.context === 'dashboard') {
      this.router.navigate(['/dashboard/select-car']);
      return;
    }

    this.ready = true;
  }

  goToCheckout() {
    this.router.navigate(['/dashboard/checkout']);
  }

  goToDashboard(carData?) {

    if (carData) {
      sessionStorage.setItem('currentCar', JSON.stringify(carData));
    }
    this.router.navigate(['/dashboard']);
  }

}
