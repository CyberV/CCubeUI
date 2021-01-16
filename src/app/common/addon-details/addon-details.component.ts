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

  @Input() addon:any;
  @Input() adhoc:any;
  @Input() showClose: any;
  @Input() bookedTime:any;

  @Output() changeAddon = new EventEmitter();
  @Output() scheduleLater = new EventEmitter();

  @Output() scheduleDate = new EventEmitter();

  minDate: Date;
  maxDate: Date;

  selectedDate:any;
  laterSelected:boolean;
  loading:boolean;

  startDate:any;
  isAdhoc:boolean;
  constructor(
    private planService:PlanService,
    private userService:UserService,
    private carService:CarService,
    private loginServie:LoginService,
    private modalController: ModalController
  ) {
    this.isAdhoc = false;
    this.laterSelected = true;
    this.startDate = null;
    this.loading = false;
    this.bookedTime = false;
  }

  selectDate(date) {
    this.laterSelected = false;
    this.scheduleDate.emit(new Date(date));
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
    return this.bookedTime ? new Date(this.bookedTime).toString().split(' ').slice(1,3).join(' ') : 'NA';  
  }
  
  scheduleAddon(addon) {
    this.loading = true;

    let payload = {
      phone: this.userService.getCurrentUser().phone,
      carRegNo: this.carService.getCurrentCar().regNo,
      addonCode: addon.code,
      scheduledDate: this.selectedDate
    };
    this.loginServie.scheduleAddon(payload).subscribe((response:any)=> {
      this.loading = false;
      console.log('Response from Scheduke addon', response);
      if (response.success) {
        alert('Service Scheduled' );
      }
      this.closeModal();
    });
  }

  
  closeModal() {
    this.modalController.dismiss();
  }

  isAfter7pm() {
    let now:any = new Date().toLocaleTimeString();
    let later = "7:00:00 PM";

    return now > later;
  }

  ngOnInit() {
    if (this.adhoc && !this.addon) {
      this.addon = this.adhoc;
      this.isAdhoc = true;

      this.startDate = 'Tomorrow';
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      this.minDate = new Date(currentYear, currentMonth, currentDate + (this.isAfter7pm() ? 2 : 1));
      this.maxDate = new Date(currentYear, currentMonth + 1, currentDate);
    } else if (this.addon) {
      this.isAdhoc = false;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      this.minDate = new Date(currentYear, currentMonth, currentDate +  (this.isAfter7pm() ? 2 : 1));
      this.maxDate = new Date(currentYear, currentMonth + 1, currentDate);

      let currentSubs = this.planService.getCurrentSubscription();

      if (currentSubs) {
        let startDate = new Date(currentSubs.startDate);

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const planDate = startDate.getDate();

        let foundAddon = currentSubs.filter((adn) => adn.addon.code == this.addon.code);

        if (foundAddon.length) {
          foundAddon = foundAddon[0];
          this.maxDate = new Date(foundAddon.expiresOn);
        }
  
  
        let diff = -1 * (planDate - (new Date().getDate()));
        console.log('Diff in days from cycle date', diff);


        if (diff <= 10) {
          this.startDate = 'Tomorrow';
        } else {
          let nextCycleDate = new Date(currentYear, currentMonth+1, planDate);
          this.startDate = nextCycleDate.toString().split(' ').slice(1,3).join(' ');
        }
      }

    }
    


  }



}
