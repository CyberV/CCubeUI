import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { Platform, ToastController, AlertController } from '@ionic/angular';

import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
})
export class ServicePageComponent implements OnInit {

  @Input() payments: any;

  selectedIndex:number;
  selectedCar:any;
  selectedPayment:any;

  loading:boolean;

  carSliderOptions = {
    centeredSlides: false,
    slidesPerView: 3,
  };


  constructor(
    private router:Router,
    private platform:Platform,
    private loginService: LoginService,
    public alertController: AlertController,
    private planService:PlanService,
    public toastController:ToastController,
    private carService:CarService
  ) { 
    this.payments = [];
    this.selectedCar=null;
    this.selectedIndex = 0;
    this.loading = false;
    this.selectedPayment=null;

  }

  selectCar(index) {
    
    this.selectedPayment = this.payments[index].payments[0];
    this.selectedCar = this.selectedPayment.car;
    this.carService.changeCar(this.selectedCar);
    this.selectedIndex = index;
  }

  ngOnInit() {
   
  }

  ionViewWillEnter() {
  }

  ngOnChanges(changes) {
    if (changes.payments && this.payments.length) {
      this.selectedIndex = 0;
      if (this.payments.length) {
        this.selectedPayment = this.payments[this.selectedIndex].payments[0];
        this.selectedCar =  this.selectedPayment.car;
        this.selectCar(this.selectedIndex);
      }
    }
  }

  ngAfterViewInit() {

  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  addCar() {
    this.carService.clear();
    this.router.navigate(['/dashboard/select-car'])
  }

  handleRenewPlan(data) {
    let {plan,car, lastDate, payment} = data;

    sessionStorage.setItem('currentPayment', JSON.stringify(payment));
    this.carService.changeCar(car);
    this.planService.renewPlan(plan, lastDate);

    this.router.navigate(['/dashboard/checkout']);
  }

  handleUpgradePlan(data) {
    let {plan} = data;

    let {car, payment, expiresOn} = this.selectedPayment;

    sessionStorage.setItem('currentPayment', JSON.stringify(payment));
    this.carService.changeCar(car);
    this.planService.renewPlan(plan, new Date(expiresOn));

    this.router.navigate(['/dashboard/checkout']);
  }

  showPlanDetails(data) {
    this.planService.changePlanForCar(data.plan.name);
    this.router.navigate(['/dashboard/plan']);
  }

  showUpgradeSlider() {
    let show = false;
    if (this.selectedPayment.nextPlan) {
      if (this.selectedPayment.nextPlan.name != 'Elite') {
        show = true;
      }
    } else { 
      if (this.selectedPayment.plan.name != 'Elite') {
        show = true;
      }
    }

    return show;
  }


}
