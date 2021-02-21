import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, QueryList } from '@angular/core';
import { CarService } from 'app/services/car.service';


@Component({
  selector: 'car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
})
export class CarFormComponent implements OnInit {

  @Input() verifyOnly: boolean;

  @Output() carReady = new EventEmitter();

  showCarSelector: boolean;
  findingCar: boolean;
  loading: boolean;
  currentCar: any;
  showFileUploader: boolean;

  isModelSelected: boolean;

  @Input() regNo: any;
  maker: string;
  model: string;

  get regError() {
    let er = ((!this.isModelSelected && (this.regNo.length == 0 && this.findingCar)) ? 'Registration Number is Required' : null);
    return er;
  }

  @ViewChildren('ctaCar') ctaCar: QueryList<HTMLElement>;


  constructor(
    private carService: CarService
  ) {
    this.showCarSelector = false;
    this.findingCar = false;
    this.loading = false;
    this.verifyOnly = false;
    this.showFileUploader = false;
    this.regNo = "";
    this.isModelSelected = false;
  }


  get isTypingRegNo() {
    return this.regNo && this.regNo.length > 2;
  }

  get isRegNoValid() {
    let valid = false;
    let reg = this.regNo && this.regNo.toString();

    if (!reg) {
      return valid;
    }
    if (reg.length < 8) {
      return valid;
    }

    if (isNaN(reg[0]) && isNaN(reg[1])) {    // HR
      if (!isNaN(reg[2]) && !isNaN(reg[3])) {    // 51

        if (!isNaN(reg[reg.length - 1]) && !isNaN(reg[reg.length - 2])) {
          valid = true;
        }

      }
    }
    return valid;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.regNo) {
      this.regNo = "";
    }
    if (!this.showFileUploader && this.regNo && this.regNo.length > 6 && this.isRegNoValid) {
      this.findingCar = true;
    }
  }

  saveCar(carData) {
    if (!this.verifyOnly) {
      this.carService.changeCar(carData);
    };

    this.isModelSelected = true;

    this.currentCar = this.carService.getCurrentCar()
  }

  focusTo(elem) {
    if (!elem) {
      return;
    }

    this.ctaCar.first.focus();

    console.log('focussing on', elem);


  }

  onError(error) {
    if (error.vehicleTypeMismatch) {

    } else {
      this.currentCar = this.carService.getCurrentCar();

      if (this.currentCar) {
        this.currentCar.regNo = this.regNo;

        this.carService.changeCar(this.currentCar);
        this.findingCar = false;

        this.showFileUploader = true;

        setTimeout(() => {
          this.goToPlans(this.currentCar);
        }, 2000);
      } else {
        this.showFileUploader = true;
        this.regNo="";
        this.findingCar = false;
      }
    }

  }

  goToPlans(carDetails) {



    if (!this.verifyOnly) {
      this.carService.changeCar(carDetails);
    }


    this.carReady.emit({ ...carDetails, regNo: this.regNo ? this.regNo.trim() : '' });

    //this.router.navigate(['plans'], { state: carDetails});
  }


}
