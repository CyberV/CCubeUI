import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { Platform, ToastController } from '@ionic/angular';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
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
    this.selectedCar = this.payments[index].car;
    this.selectedPayment = this.payments[index];
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
        this.selectedPayment = this.payments[this.selectedIndex];
        this.selectedCar =  this.selectedPayment.car;
      }
    }
  }

  ngAfterViewInit() {
    this.platform.ready().then( (data) => {
      if (FCM &&  FCM.getToken()) {
        FCM.getToken().then((res:any) => {
          this.loginService.updateToken(res).subscribe((response:any) => {
            if (!response.success) {
              this.presentToast(response.errorMsg || JSON.stringify(response.error));
            }
          });
        });

        FCM.onTokenRefresh().subscribe((res:any) => {
          this.loginService.updateToken(res).subscribe((response:any) => {
            if (!response.success) {
              this.presentToast(response.errorMsg || JSON.stringify(response.error));
            }
          });
        })
    
        FCM.onNotification().subscribe(data => {
          this.presentToast(JSON.stringify(data));
        });
      }

    })
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


}
