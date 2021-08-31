import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'car-display',
  templateUrl: './car-display.component.html',
  styleUrls: ['./car-display.component.scss'],
})
export class CarDisplayComponent implements OnInit {

  @Input() carNo: string;
  @Input() verifyOnly: boolean;
  @Output() error = new EventEmitter();



  @Output() letsgo = new EventEmitter();
  @Output() carReady = new EventEmitter();

  noCar: boolean;
  loading: boolean;
  isCarReady: boolean;
  carDetails: any;
  vehicleTypeMismatch: boolean;

  entry: any;

  constructor(private srvcLogin: LoginService, private activatedRoute:ActivatedRoute) {
    this.carNo = "";
    this.loading = true;
    this.isCarReady = false;
    this.noCar = false;
    this.verifyOnly = false;
    this.vehicleTypeMismatch = false;

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
      setTimeout(() => {
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

          res.data.registeredOn = new Date(res.data.registeredOn).toLocaleDateString();

          this.carDetails = res.data;

          let makerStr = this.carDetails.maker.split(' ')[0].toLowerCase();
          let modelStr = this.carDetails.model.toLowerCase().replace(makerStr, "").trim();


          this.carDetails.name = modelStr;
          this.vehicleTypeMismatch = !(this.carDetails.vehicleType && this.carDetails.vehicleType.indexOf('(LMV)') > 0);

          if (!this.vehicleTypeMismatch) {
            this.carReady.emit(this.carDetails);

            if (this.verifyOnly) {
              this.letsgo.emit(this.carDetails);
            }
          }



          // this.page = "signup";
        } else {
          let msg = 'There was an issue in getting your car details. ' + (this.verifyOnly ? 'Please continue to Checkout' : 'Please try again or enter Make/Model manually.');
          alert(msg);
          this.loading = false;
          this.error.next({
            error: res.error
          });
        }
      }, (res) => {
        this.loading = false;
        if (res.success) {
        } else {
          if (this.activatedRoute.snapshot.routeConfig.path == 'select-car')
          alert('There was an issue in getting your car details.');
          this.error.next({
            error: res.error
          });
          console.error('Error in loading details', res.errorMsg);
        }
      });
  }


}
