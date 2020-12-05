import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'confirm-location',
  templateUrl: './confirm-location.component.html',
  styleUrls: ['./confirm-location.component.scss'],
})
export class ConfirmLocationComponent implements OnInit {



  location:any;

  isUnlisted:boolean;
  allInputs:any;

  get allFieldsReady() {
    return this.location.houseNo.length && this.location.city.length && this.location.state.length && this.location.society && this.location.society.length;
  }

  @Output() confirm = new EventEmitter();

  @ViewChildren('inpStreet') inpStreet: QueryList<HTMLElement>;
  @ViewChildren('inpSociety') inpSociety: QueryList<HTMLElement>;
  @ViewChildren('inpCity') inpCity: QueryList<HTMLElement>;
  @ViewChildren('ctaConfirm') ctaConfirm: QueryList<HTMLElement>;

  constructor(
    private userService:UserService
  ) {
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
    let city = this.userService.getCurrentUser().city;
    if(city) {
      this.location.city = city;
    }
  }



}
