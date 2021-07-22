import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanService } from 'app/services/plan.service';
import { ModalController } from '@ionic/angular';
import { LoginService } from 'app/login/login.service';
import { UserService } from 'app/services/user.service';
import { CarService } from 'app/services/car.service';



@Component({
  selector: 'addon-details',
  templateUrl: './addon-details.component.html',
  styleUrls: ['./addon-details.component.scss'],
})
export class AddonDetailsComponent implements OnInit {

  @Input() addon: any;
  @Input() adhoc: any;
  @Input() showClose: any;
  @Input() purchased: boolean;
  @Input() bookedTime: any;
  @Input() fromDashboard: boolean;

  @Output() changeAddon = new EventEmitter();
  @Output() scheduleLater = new EventEmitter();

  @Output() scheduleDate = new EventEmitter();

  minDate: Date;
  maxDate: Date;

  selectedDate: any;
  laterSelected: boolean;
  loading: boolean;

  startDate: any;
  isAdhoc: boolean;

  dateError: any;

  months:number;
  addonScheduled:any;

  constructor(
    private planService: PlanService,
    private userService: UserService,
    private carService: CarService,
    private loginServie: LoginService,
    private modalController: ModalController
  ) {
    this.isAdhoc = false;
    this.laterSelected = true;
    this.startDate = null;
    this.loading = false;
    this.bookedTime = false;
    this.fromDashboard = false;
    this.purchased = false;
    this.dateError = null;
  }

  selectDate(date, later = false) {
    this.laterSelected = later;
    this.checkDate(date);
    this.addon.scheduledDate = this.selectedDate;

    if (this.purchased) {
      this.planService.changeDateForAdhoc(this.addon);
    }

      this.scheduleDate.emit({
        date: date ? new Date(date) : null,
        adhoc: this.addon,
        error: this.laterSelected ? false : !!this.dateError
      });
    
  }

  sendScheduleLater() {
    let payload = {};
    if (this.isAdhoc) {
      payload = {
        isAdhoc: true,
        adhoc: this.adhoc
      }
    } else {

      payload = {
        isAdhoc: false,
        addon: this.addon

      }
    }
    this.scheduleLater.emit(payload);
  }

  get bookedDate() {
    return this.bookedTime ? new Date(this.bookedTime).toString().split(' ').slice(1, 3).join(' ') : 'NA';
  }


  addAddonToCart() {
    this.addon.scheduledDate = this.selectedDate;
    this.modalController.dismiss({
      addon: this.addon
    });
  }

  onAddonDurationToggle(duration) {
    let addons = this.planService.getIncludedAddons();
    if (addons.length) {
      this.addon = addons[0];
    } else {
      let multiplier = duration == 'quarterly' ? 3 : 1;
      this.addon.price = this.addon.pricing[this.carService.getCurrentCar().bodyType] * multiplier;
    }
  }

  scheduleAddon(addon) {
    this.loading = true;

    let payload = {
      phone: this.userService.getCurrentUser().phone,
      carRegNo: this.carService.getCurrentCar().regNo,
      addonCode: addon.code,
      scheduledDate: this.selectedDate
    };
    this.loginServie.scheduleAddon(payload).subscribe((response: any) => {
      this.loading = false;
      console.log('Response from Scheduke addon', response);
      if (response.success) {
        alert('Service Scheduled');
      }
      this.closeModal();
    });
  }


  closeModal() {
    this.modalController.dismiss();
  }

  isAfter7pm() {
    let now: any = new Date().toLocaleTimeString();
    let later = "7:00:00 PM";

    return now > later;
  }

  validate = dateString => {
    const day = (new Date(dateString)).getDay();
    if (day == 3) {
      return false;
    }
    return true;
  }

  checkDate(e) {
    
    if (this.addon && this.addon.code == 'FBW' && !this.validate(e)) {
      this.dateError = 'Wednesdays are Off!';
      this.selectedDate = e;
    } else {
      this.selectedDate = e;
      this.dateError = null;
    }
  }

  ngOnChanges(changes) {
    if ((this.addon && this.addon.scheduledDate) || (this.bookedTime)) {
      this.selectedDate = this.addon.scheduledDate;
      this.laterSelected = false;
      this.bookedTime = this.selectedDate;
    }
  }

  ngOnInit() {

    let sub = this.planService.getCurrentSubscription();
    let months = null;

    if (sub) {
      let renewDate = new Date(sub.renewDate);
      let today = new Date();

      months = renewDate.getMonth() - today.getMonth();
      this.months = months;

      if (months > 1) {

        
      } else {
        //this.planService.updatePlanDuration('monthly');
      }
    
    } else {
      //this.planService.updatePlanDuration('monthly');
      this.months = 1;
    }


    if (this.adhoc && !this.addon) {
      this.addon = this.adhoc;
      this.isAdhoc = true;

      if ((this.addon && this.addon.scheduledDate) || (this.bookedTime)) {
        this.selectedDate = this.addon.scheduledDate;
        this.laterSelected = false;
        //this.bookedTime = this.selectedDate;
      }

      this.startDate = 'Tomorrow';
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      this.minDate = new Date(currentYear, currentMonth, currentDate + (this.isAfter7pm() ? 2 : 1));
      this.maxDate = new Date(currentYear, currentMonth + 1, currentDate);
    } else if (this.addon) {
      if (this.addon && this.addon.scheduledDate) {
        this.selectedDate = this.addon.scheduledDate;
      }
      this.isAdhoc = false;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      this.minDate = new Date(currentYear, currentMonth, currentDate + (this.isAfter7pm() ? 2 : 1));
      this.maxDate = new Date(currentYear, currentMonth + 1, currentDate);

      let currentSubs = this.planService.getCurrentSubscription();

      let car = this.carService.getCurrentCar();
      if (currentSubs && currentSubs.carRegNo == car.regNo) {


        let startDate = new Date(currentSubs.startDate);

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const planDate = startDate.getDate();

        let foundAddon = currentSubs.addons.filter((adn) => adn.addon.code == this.addon.code);

        if (foundAddon.length) {
          foundAddon = foundAddon[0];
          this.maxDate = new Date(foundAddon.expiresOn);
        }

        let diff = -1 * (planDate - (new Date().getDate()));
        console.log('Diff in days from cycle date', diff);

        this.planService.canUpgradeThisMonth(currentSubs);
        
        if (diff <= 10) {
          this.startDate = 'Tomorrow';
        } else {
          let nextCycleDate = new Date(currentYear, currentMonth + 1, planDate);
          this.startDate = nextCycleDate.toString().split(' ').slice(1, 3).join(' ');
        }
      }

    }

    this.addonScheduled = this.fromDashboard && this.purchased && this.addon && this.addon.scheduledDate ? this.addon.scheduledDate : false;





  }

  openReschedule() {
    this.modalController.dismiss({
      openReschedule: true,
      addon: this.addon
    });
  }



}
