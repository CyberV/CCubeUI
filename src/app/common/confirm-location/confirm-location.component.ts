import { Component, OnInit, Output, EventEmitter, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { SelectSocietyComponent } from '../select-society/select-society.component';

@Component({
  selector: 'confirm-location',
  templateUrl: './confirm-location.component.html',
  styleUrls: ['./confirm-location.component.scss'],
})
export class ConfirmLocationComponent implements OnInit {



  @Input() location:any;
  @Output() retryCoupons = new EventEmitter();

  isUnlisted:boolean;
  disableAll:boolean;
  allInputs:any;

  get allFieldsReady() {
    let loc = this.location.location || this.location;
    return loc.houseNo.length > 0 && loc.city.length > 0 && loc.state.length > 0 && ((loc.society && loc.society.length > 0) ||(loc.location && loc.location.society.length > 0));
  }

  @Output() confirm = new EventEmitter();

  societyData:any;

  @ViewChildren('inpStreet') inpStreet: QueryList<HTMLElement>;
  @ViewChild('inpSociety') inpSociety: SelectSocietyComponent;
  @ViewChildren('inpCity') inpCity: QueryList<HTMLElement>;
  @ViewChildren('ctaConfirm') ctaConfirm: QueryList<HTMLElement>;

  constructor(
    private userService:UserService
  ) {
    this.disableAll = false;
    this.location = {
      houseNo: '',
      block: '',
      society:'',
      city: '',
      state: ''
    };
    this.isUnlisted = false;

   }


   focusTo(emt) {

    this.allInputs = {
      inpStreet: this.inpStreet.first,
      inpCity: this.inpCity.first,
      inpSociety: (this.inpSociety )as any,
      ctaConfirm: this.ctaConfirm.first,
    }

    let e = this.allInputs[emt];

    if (e) {
      e.focus();
    }
  }

  sendRetryCoupon() {
    let payload = {
      isUnlisted: this.isUnlisted,
      society: this.location.society
    };
    localStorage.setItem('selectedSociety', JSON.stringify(payload));
    this.retryCoupons.emit();
  }

  handleSocietyChange(data) {
    console.log('Confirm location', data);
    this.isUnlisted = data.isUnlisted;
    this.location.society = data.society;
  }

   sendConfirmation() {
     this.confirm.emit({
       location: this.location,
      isUnlisted: this.isUnlisted 
      });
   }
  ngOnInit() {
    let user = this.userService.getCurrentUser();
    let city = user && user.city;
    if (city) {
      this.location.city = city;
    }

    if(this.location.houseNo && this.location.houseNo.length) {
      this.disableAll  = true;
      this.sendConfirmation();
    }

    let soc = localStorage.getItem('selectedSociety');

    this.societyData = soc && soc != "null" ? JSON.parse(soc) : null;

    if (this.societyData) {
      this.isUnlisted = this.societyData.isUnlisted;
      this.location.society = this.societyData.society;

      if (this.isUnlisted) {
        this.inpSociety.showUnlisted(this.societyData.society);
        //this.location.society = 'Other';
      }
    }

  }



}
