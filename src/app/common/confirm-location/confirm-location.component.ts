import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList, Input } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'confirm-location',
  templateUrl: './confirm-location.component.html',
  styleUrls: ['./confirm-location.component.scss'],
})
export class ConfirmLocationComponent implements OnInit {



  @Input() location:any;

  isUnlisted:boolean;
  disableAll:boolean;
  allInputs:any;

  get allFieldsReady() {
    return this.location.houseNo.length > 0 && this.location.city.length > 0 && this.location.state.length > 0 && !!this.location.society && this.location.society.length > 0;
  }

  @Output() confirm = new EventEmitter();

  @ViewChildren('inpStreet') inpStreet: QueryList<HTMLElement>;
  @ViewChildren('inpSociety') inpSociety: QueryList<HTMLElement>;
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
      inpSociety: this.inpSociety.first,
      ctaConfirm: this.ctaConfirm.first,
    }

    let e = this.allInputs[emt];

    if (e) {
      e.focus();
    }
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

  }



}
