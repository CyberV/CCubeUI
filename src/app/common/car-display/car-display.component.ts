import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'car-display',
  templateUrl: './car-display.component.html',
  styleUrls: ['./car-display.component.scss'],
})
export class CarDisplayComponent implements OnInit {

  @Input() carNo: string;
  @Input() verifyOnly: boolean;

  @Output() letsgo = new EventEmitter();
  @Output() carReady = new EventEmitter();

  noCar:boolean;
  loading: boolean;
  isCarReady:boolean;
  carDetails: any;

  entry:any;

  constructor(private srvcLogin: LoginService) {
    this.carNo = "";
    this.loading = true;
    this.isCarReady = false;
    this.noCar = false;
    this.verifyOnly = false;

    this.carDetails = {
      maker: '',
      model: ''
    }

    this.entry = {
      begin: false
    };
  }

  ngOnInit() {
      this.noCar = !(this.carNo && this.carNo.length);

      if (this.noCar) {
        return;
      } else {
        this.loading = true;
        this.getCarDetails(this.carNo);
        setTimeout( ()=> {
          this.beginDisplay();
        }, 1000);
      }
  }

  beginDisplay() {
    this.entry.begin = true;
  }

  sendAction() {
    this.letsgo.emit(this.carDetails);
  }



  getCarDetails(regNo) {
    this.loading = true;
    this.srvcLogin.getCarDetails(regNo)
      .subscribe((res: any) => {
        console.log('Car Details Response', res);
        if (res.success) {
          this.loading = false;

          this.isCarReady = true;

          let mm = res.raw['Maker / Model'];
          mm = mm.split('/');

          this.carDetails = {
            maker : mm [0].replace("PVT LTD",""),
            model : mm [1],
            fuelType : res.raw["Fuel Type"],
            registeredOn: new Date(res.raw["Registration Date"]).toDateString(),
            year: new Date(res.raw["Registration Date"]).getFullYear(),
            ownerName: res.raw["Owner Name"],
            fuelNorms: res.raw["Fuel Norms"],
            insuranceUpto: res.raw["Insurance Upto"],
            fitness: res.raw["Insurance Upto"],
            bodyType: 'sedan'
          }

          let makerStr = this.carDetails.maker.split(' ')[0].toLowerCase();
          let modelStr = this.carDetails.model.toLowerCase().replace(makerStr,"").trim();
          

          this.carDetails.name = modelStr;

          this.carReady.emit(this.carDetails);
          
          if(this.verifyOnly) {
            this.letsgo.emit(this.carDetails);
          }

          // this.page = "signup";
        } else {
          alert ('There was an issue in getting your car details. Please try again or enter Make/Model manually.');
          this.loading = false;

        }
      }, (res) => {
        this.loading = false;
        if (res.success) {
        } else {
          alert ('There was an issue in getting your car details. Please try again or enter Make/Model manually.');
          console.error('Error in loading details', res.errorMsg);
        }
      });
  }


}
