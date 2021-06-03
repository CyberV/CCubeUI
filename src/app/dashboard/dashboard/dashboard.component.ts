import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import plansList from 'assets/planslist.json';
import { planData } from 'app/common/common.service';

import { Platform, MenuController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { PlanTableComponent } from 'app/common/plan-table/plan-table.component';
import { Router } from '@angular/router';
import { ModalPage } from 'app/modal/modal.page';
import { CarService } from 'app/services/car.service';
import { PlanService } from 'app/services/plan.service';
import { scrollElementToTop } from 'app/util/util';
import { PlanSliderComponent } from 'app/common/plan-slider/plan-slider.component';
import { AddonDetailsComponent } from 'app/common/addon-details/addon-details.component';


declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  @Input() currentCar: any;
  @Input() includedAddons:any;
  @Input() includedAdhocs:any;
  @Input() planDuration:string;

  selectedPlan: any;

  isCarSelected: boolean;
  isPlanSelected: boolean;
  addOns: any;

  currentPlans;

  slideOpts: any;

  @ViewChildren('planSlider') planSlider: QueryList<HTMLElement>;

  constructor(
    private carService: CarService,
    private platform: Platform,
    public modalController: ModalController,
    private menu: MenuController,
    private planService:PlanService,
    private toastController:ToastController,
    private router: Router
  ) {
    this.currentCar = {};
    this.isCarSelected = false;

    this.isPlanSelected = false;
    this.selectedPlan = {};
    this.includedAddons = [];

    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };
  }

  onDurationToggle(duration) {
    this.currentPlans = this.planService.getAllPlans();
  }

  async openAddon(addon) {
    const modal = await this.modalController.create({
      component: AddonDetailsComponent,
      cssClass: 'plans-table-modal',
      componentProps: { 
        addon: addon.isAdhoc ? null : addon,
        adhoc: addon.isAdhoc ? addon : null,
        showClose: true 
      },
      swipeToClose: true,
      showBackdrop: true,
      backdropDismiss: true,
    });
    await modal.present();

    modal.onDidDismiss().then((data)=> {
      if (data.data && data.data.addon) {
        let a =  data.data.addon;
        if (a.isAdhoc) {
          this.onAdhocSelect(a);
        } else {
          this.onAddonSelect(a);
        }
        
      }
    });
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: PlanTableComponent,
      cssClass: 'plans-table-modal',
      componentProps: { 
        bodyType: 'sedan',
        showClose: true
      }
    });
    await modal.present();

    modal.onDidDismiss().then((data)=> {

      if (data && data.data) {
        let fltrdPlans = this.currentPlans.plans.filter( (plan) => plan.name.toLowerCase() == data.data.planName.toLowerCase());

        if (fltrdPlans && fltrdPlans.length) {
          this.buyPlan( {
            plan: fltrdPlans[0]
          });
        }
      }

    });
  }

  get isMobile() {
    return !this.platform.is('desktop');
  }


  async ngOnInit() {
    this.currentPlans = this.planService.getAllPlans();
    console.log('Loaded Plans?, ',this.currentPlans);
  }

  async ngAfterViewInit() {

    this.planService.clear();
    this.planService.clearAddons();
    this.planService.clearAdhocs();
    //this.includedAddons = this.planService.getIncludedAddons();

    this.isPlanSelected = false;
    

  }

  ngOnChanges(changes) {


    if (changes.planDuration) {
      this.planService.updatePlanDuration(this.planDuration);
    }
    let car = this.carService.getCurrentCar();
    
    
    if (car) {
      this.currentCar = car;
      this.isCarSelected = true;
    }
  }

  onAddonSelect(addon) {

    //this.planService.includeAddon(addon);

    this.presentToast('Please select a Plan');

    // scrollElementToTop(document.querySelectorAll('plan-slider')[0]);
    let cont  =  $('.container');
    cont[cont.length - 1].scrollTop = 300;
  }

  onAdhocSelect(adhoc) {
    this.planService.clear();
    this.planService.includeAdhoc(adhoc);
    this.router.navigate(['/dashboard/adhoc'])

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  resetCar() {
    this.carService.clear();
    //this.isCarSelected = false;
    this.goToCarSelector();
  }

  goToCarSelector() {
    //this.carService.clear();
    this.router.navigate(['/dashboard/select-car']);
  }

  showPlans(carDetails) {
    // this.currentCar = carDetails;


    // this.isCarSelected = true;


    // this.ngOnInit();
  }

  buyPlan(payload) {
    this.isPlanSelected = true;
    this.selectedPlan = payload.plan;
    this.planService.changePlan(this.selectedPlan);
    this.goToCheckout();

  }

  onShowDetails(payload) {
    this.isPlanSelected = true;
    this.selectedPlan = payload.plan;
    this.planService.changePlan(this.selectedPlan);
    if (payload.feature) {
    this.router.navigate(['/dashboard/plan', {code: payload.feature.code}]);

    } else {
    this.router.navigate(['/dashboard/plan']);
    }

  }

  goToCheckout() {
    
    this.router.navigate(['/dashboard/checkout']);
  }



  

  categories = {
    slidesPerView: 2,
  };


}



