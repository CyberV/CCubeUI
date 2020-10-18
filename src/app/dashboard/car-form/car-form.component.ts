import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  currentCar:any;
  showFileUploader:boolean;

  @Input() regNo: any;
  maker: string;
  model: string;


  constructor(
    private carService:CarService
  ) {
    this.showCarSelector = false;
    this.findingCar = false;
    this.loading = false;
    this.verifyOnly = false;
    this.showFileUploader = false;
    this.regNo="";
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

  ngOnInit() { }

  saveCar(carData) {
    if (!this.verifyOnly) {
      this.carService.changeCar(carData);
    };

    this.currentCar = this.carService.getCurrentCar()
  }

  onError(error) {
    if (error.vehicleTypeMismatch) {

    } else {
      this.showFileUploader = true;
    }
    
  }

  goToPlans(carDetails) {

    

    if (!this.verifyOnly) {
      this.carService.changeCar(carDetails);
    }


    this.carReady.emit({...carDetails, regNo:this.regNo});

    //this.router.navigate(['plans'], { state: carDetails});
  }


}
