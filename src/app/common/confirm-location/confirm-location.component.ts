import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'confirm-location',
  templateUrl: './confirm-location.component.html',
  styleUrls: ['./confirm-location.component.scss'],
})
export class ConfirmLocationComponent implements OnInit {



  location:any;

  get allFieldsReady() {
    return this.location.houseNo.length && this.location.city.length && this.location.state.length && this.location.society && this.location.society.length;
  }

  @Output() confirm = new EventEmitter();

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
   }

   sendConfirmation() {
     this.confirm.emit(this.location);
   }
  ngOnInit() {
    let city = this.userService.getCurrentUser().city;
    if(city) {
      this.location.city = city;
    }
  }

}
