import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
})
export class CarFormComponent implements OnInit {

  @Output() carReady = new EventEmitter();

  showCarSelector:boolean;
  findingCar:boolean;
  loading: boolean;

  regNo:any;
  maker:string;
  model:string;


  constructor() {
    this.showCarSelector = false;
    this.findingCar = false;
    this.loading = false;
  }

  
  get isTypingRegNo() {
    return this.regNo && this.regNo.length > 2;
  }

  get isRegNoValid() {
    let valid = false;
    let reg = this.regNo && this.regNo.toString();

    if (!reg ) {
      return valid;
    } 
    if (reg.length < 8) {
      return valid;
    }

    if (isNaN(reg[0]) && isNaN(reg[1]) ) {    // HR
      if (!isNaN(reg[2]) && !isNaN(reg[3])) {    // 51
        if(isNaN(reg[4])) {
          if (!isNaN(reg[reg.length - 1]) && !isNaN(reg[reg.length - 2]) ) {
            valid = true;
          }
        }
      }
    }
    return valid;
  }

  ngOnInit() {}

  goToPlans(carDetails) {


    sessionStorage.setItem('currentCar', JSON.stringify(carDetails));

    this.carReady.emit(carDetails);

    //this.router.navigate(['plans'], { state: carDetails});
  }


}
