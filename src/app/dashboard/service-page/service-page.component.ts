import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { Platform, ToastController, AlertController, IonSlides } from '@ionic/angular';

import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
})
export class ServicePageComponent implements OnInit {

  @Input() payments: any;

  selectedIndex: number;
  selectedCar: any;
  selectedPayment: any;

  loading: boolean;
  sliderInitialized: boolean;
  upgradePlans:any;

  carSliderOptions = {
    centeredSlides: false,
    slidesPerView: 3,
    spaceBetween: 20,
  };

  planSliderOptions = {
    centeredSlides: false,
    slidesPerView: 1,
    spaceBetween: 20
  };

  @ViewChildren('planSlider') planSlider: QueryList<IonSlides>;


  constructor(
    private router: Router,
    private platform: Platform,
    private loginService: LoginService,
    public alertController: AlertController,
    private planService: PlanService,
    public toastController: ToastController,
    private carService: CarService
  ) {
    this.payments = [];
    this.upgradePlans = [];
    this.selectedCar = null;
    this.selectedIndex = 0;
    this.loading = false;
    this.selectedPayment = null;
    this.sliderInitialized = false;
    

  }

  demoEvent(evt) {
    console.log('Demo evt', evt);
  }

  selectCar(index) {
    this.selectedPayment = this.payments[index].payments[0];
    this.selectedCar = this.selectedPayment.car;
    this.carService.changeCar(this.selectedCar);
    this.selectedIndex = index;

    this.upgradePlans = [];

    setTimeout(()=> {
      this.upgradePlans = this.planService.getUpgradePlans(this.selectedPayment.plan.name);
    }, 100);
    
    setTimeout(()=> {
      if (this.planSlider && this.planSlider.first) {
        if (!this.sliderInitialized) {
  

  
          this.planSlider.first.ionSlideDidChange.subscribe((ev) => {
            console.log('Slider Event', ev);
            this.planSlider.first.getActiveIndex().then((da)=> {
              console.log('Active Index', da);
              this.selectCar(da);
            })
           
          });
          this.sliderInitialized = true;
        } 
          
      }
    }, 2000);

    setTimeout(()=> {
      if (this.planSlider && this.planSlider.first) {
        this.planSlider.first.slideTo(this.selectedIndex);
      }
    }, 50);


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
        this.selectedCar = this.selectedPayment.car;
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
    let { plan, car, lastDate, payment } = data;

    sessionStorage.setItem('currentPayment', JSON.stringify(payment));
    this.carService.changeCar(car);
    this.planService.renewPlan(plan, lastDate);

    this.router.navigate(['/dashboard/checkout']);
  }

  handleUpgradePlan(data) {
    let { plan } = data;

    this.planService.changePlanForCar(plan.name);
    plan = this.planService.getSelectedPlan();

    let { car, payment, expiresOn } = this.selectedPayment;

    sessionStorage.setItem('currentPayment', JSON.stringify(payment));
    this.carService.changeCar(car);
    this.planService.renewPlan(plan, new Date(+(new Date(this.payments[this.selectedIndex].renewDate)) - 86400000));

    this.router.navigate(['/dashboard/checkout']);
  }

  showPlanDetails(data) {
    let { car, payment, expiresOn } = this.selectedPayment;

    sessionStorage.setItem('currentPayment', JSON.stringify(payment));
    this.planService.clear();
    this.planService.changePlanForCar(data.plan.name);
    let plan = this.planService.getSelectedPlan();
    this.planService.renewPlan(plan, new Date(+(new Date(this.payments[this.selectedIndex].renewDate)) - 86400000));

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
