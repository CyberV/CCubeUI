import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { Platform, ToastController, AlertController, IonSlides, ModalController } from '@ionic/angular';

import { LoginService } from 'app/login/login.service';
import { PlanService } from 'app/services/plan.service';
import { NotificationService } from 'app/services/notification.service';
import { AddonDetailsComponent } from 'app/common/addon-details/addon-details.component';
import { ShareService } from 'app/services/share.service';
import { share } from 'rxjs/operators';
import { PlanSliderComponent } from 'app/common/plan-slider/plan-slider.component';
import { scrollElementToTop } from 'app/util/util';
import { RescheduleComponent } from 'app/common/reschedule/reschedule.component';

declare var $;
@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
})
export class ServicePageComponent implements OnInit {

  @Input() payments: any;


  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  selectedIndex: number;
  selectedCar: any;
  selectedPayment: any;

  subAddons: any;
  subAdhocs: any;

  loading: boolean;
  sliderInitialized: boolean;
  upgradePlans: any;
  selectedSubscription: any;
  currentPlans: any = [];

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
  @ViewChildren('planSelector') planSelector: QueryList<PlanSliderComponent>;

  notifications: any;

  getNotificationCount(regNo) {
    try {


      if (this.notifications && this.notifications.length) {
        let found = this.notifications.filter((notif) => notif.data.car.regNo.toLowerCase() == regNo.toLowerCase());
        return found && found.length ? found.length : 0;
      } else {
        return 0;
      }
    } catch (e) {
      //alert('Error in nOot' + e);
      return 0;
    }
  }


  constructor(
    private router: Router,
    private platform: Platform,
    private loginService: LoginService,
    public alertController: AlertController,
    private planService: PlanService,
    private modalController: ModalController,
    public toastController: ToastController,
    private carService: CarService,
    private shareService: ShareService,
    private notificationService: NotificationService
  ) {

    this.notifications = notificationService.getNewNotifications();
    notificationService.events().subscribe((notifs: any) => {
      this.notifications = notifs.new;
    })

    this.payments = [];
    this.upgradePlans = [];
    this.selectedCar = null;
    this.selectedIndex = 0;
    this.loading = false;
    this.selectedPayment = null;
    this.sliderInitialized = false;
    this.selectedSubscription = null;
    this.subAddons = [];
    this.subAdhocs = [];

    // this.platform.backButton.subscribeWithPriority(1, () => { // to disable hardware back button on whole app
    // });
    console.log('subscribing to back');
    this.platform.backButton.subscribe(async (d) => {

      document.addEventListener('backbutton', this.onBackButton, true);
    });
  }

  demoEvent(evt) {
    console.log('Demo evt', evt);
  }

  async areaCleaned() {

  }

  ngOnDestroy() {
    console.log('Service Page Destroyed');
    document.removeEventListener('backbutton', this.onBackButton, true);
  }

  gotoPlans(plan) {
    console.log(plan);
  }


  buyPlan(payload) {
    this.planService.changePlan(payload.plan);
    this.goToCheckout();

  }

  onShowDetails(payload) {

    this.planService.changePlan(payload.plan);
    if (payload.feature) {
    this.router.navigate(['/dashboard/plan', {code: payload.feature.code}]);

    } else {
    this.router.navigate(['/dashboard/plan']);
    }

  }

  refreshPlans() {
    this.currentPlans = this.planService.getAllPlans();
  }

  goToCheckout() {
    
    this.router.navigate(['/dashboard/checkout']);
  }

  async onBackButton(event) {
    event.preventDefault();
    event.stopPropagation();

    if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
      // this.platform.exitApp(); // Exit from app
      navigator['app'].exitApp(); // work in ionic 4

    } else {
      const toast = await this.toastController.create({
        message: 'Press back again to exit App.',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
      // console.log(JSON.stringify(toast));
      this.lastTimeBackPress = new Date().getTime();
    }
  }

  selectCar(index) {
    this.selectedSubscription = this.payments[index];
    this.selectedPayment = this.selectedSubscription.payments[0];
    this.selectedCar = this.selectedPayment.car;
    this.planService.updatePlanDuration(this.selectedSubscription.duration);
    this.carService.changeCar(this.selectedCar);
    this.selectedIndex = index;
    this.currentPlans = this.planService.getAllPlans();

    this.planService.setCurrentSubscription(this.selectedSubscription);

    this.upgradePlans = [];


    this.subAddons = this.selectedSubscription.addons.map((adn) => adn.addon);



    this.subAdhocs = this.selectedSubscription.adhocs.map((adn) => adn.addon);




    if (!this.selectedSubscription.isAdhoc) {
      setTimeout(() => {
        this.upgradePlans = this.planService.getUpgradePlans(this.selectedPayment);
      }, 100);
    }

    setTimeout(() => {
      if (this.planSlider && this.planSlider.first) {
        if (!this.sliderInitialized) {



          this.planSlider.first.ionSlideDidChange.subscribe((ev) => {
            console.log('Slider Event', ev);
            this.planSlider.first.getActiveIndex().then((da) => {
              console.log('Active Index', da);
              this.selectCar(da);
            })

          });
          this.sliderInitialized = true;
        }

      }
    }, 2000);

    setTimeout(() => {
      if (this.planSlider && this.planSlider.first) {
        this.planSlider.first.slideTo(this.selectedIndex);
      }
    }, 50);


  }

  ngOnInit() {
    this.currentPlans = this.planService.getAllPlans();
    console.log('Loaded Plans?, ', this.currentPlans);

  }

  async openAddon(addon) {
    let bookedTime = false;
    if (this.selectedSubscription.adhocs.length) {
      let found = this.selectedSubscription.adhocs.filter((adn) => adn.addon.code == addon.code);

      if (found.length) {
        found = found[0];
        if (found.scheduledTime) {
          bookedTime = found.scheduledTime;
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
        showClose: true,
        fromDashboard: true,
        purchased: (addon.isAdhoc ? this.selectedSubscription.adhocs : this.selectedSubscription.addons).some((a) => a.addon.name == addon.name),
        bookedTime
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data) => {
      if (data && data.data && data.data.addon && !this.selectedSubscription.isAdhoc) {
        //alert(JSON.stringify(data));
        let addon = data.data.addon;
        if (addon.isAdhoc) {
        this.onAdhocSelected(addon);
        this.router.navigate(['/dashboard/adhoc']);
        } else {
          this.onAddonSelected(addon);
          this.router.navigate(['/dashboard/addon']);
        }
      } else {
        this.promptForPlan();
      }
    });
  }

  ionViewWillEnter() {
  }

  async shareRc() {
    let shared = await this.shareService.shareRc(this.selectedCar.regNo);

    //alert('Shared ' +  shared.toString());
  }

  ngOnChanges(changes) {
    if (changes.payments && this.payments.length) {
      this.selectedIndex = 0;
      if (this.payments.length) {
        this.selectedPayment = this.payments[this.selectedIndex].payments[0];
        this.selectedCar = this.selectedPayment.car;
        this.selectCar(this.selectedIndex);
        setTimeout(()=> {
          this.selectCar(this.selectedIndex);

        }, 100);
      }
    }
  }

  ngAfterViewInit() {

    this.planService.clear();
    this.carService.clear(true);

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

  handleAdhocReschedule(adhoc) {
    let schedule = {
      date : adhoc.scheduledTime || adhoc.scheduledDate
    };

    if (schedule.date) {
      this.openReschedule(schedule, adhoc);
    }
  }

  async openReschedule(schedule, adhoc) {
    const modal = await this.modalController.create({
      component: RescheduleComponent,
      cssClass: 'plans-table-modal',
      componentProps: { 
        showClose: true,
        schedule: schedule,
        forAdhoc : true,
        adhoc: adhoc,
        count: adhoc.rescheduleCount,
        canReschedule: adhoc.rescheduleCount < 2,
        lastDate: adhoc.expiresOn
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data)=> {



    });
  }

  handleRenewPlan(data) {
    let { plan, car, lastDate, payment } = data;

    // Clear Addon
    this.carService.clear(true);

    sessionStorage.setItem('currentPayment', JSON.stringify(payment));
    this.carService.changeCar(car);
    this.planService.renewPlan(plan, lastDate);
    this.planService.clearAdhocs();

    if (this.selectedSubscription.addons.length) {
      sessionStorage.setItem('includedAddons', JSON.stringify(this.selectedSubscription.addons.map((addon) => addon.addon)));
    }

    this.router.navigate(['/dashboard/checkout']);
  }

  handleScheduleService(adhoc) {
    this.openAddon(adhoc.addon);
  }

  handleUpgradePlan(data) {
    let { plan } = data;

    this.planService.changePlanForCar(plan.name);
    plan = this.planService.getSelectedPlan();

    let { car, payment, expiresOn } = this.selectedPayment;

    // Clear Addon
    this.carService.clear(true);

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

  onAdhocSelected(adhoc) {
    this.planService.clear();
    this.planService.clearAddons();
    this.planService.clearAdhocs();
    this.planService.includeAdhoc(adhoc);
    this.router.navigate(['/dashboard/adhoc']);
  }

  promptForPlan() {
    if (this.planSelector.first) {
      this.presentToast('Please select a plan first!');
      scrollElementToTop($('.plan-slider')[0]);
    }
  }

  onAddonSelected(addon) {
    this.planService.clear();
    this.planService.clearAddons();
    this.planService.clearAdhocs();
    this.planService.includeAddon(addon);
    this.router.navigate(['/dashboard/addon']);
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
