import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
})
export class ServicePageComponent implements OnInit {

  @Input() payments: any;

  selectedIndex:number;
  selectedCar:any;
  selectedPayment:any;

  loading:boolean;

  carSliderOptions = {
    centeredSlides: false,
    slidesPerView: 3,
  };


  constructor(
    private router:Router
  ) { 
    this.payments = [];
    this.selectedCar=null;
    this.selectedIndex = 0;
    this.loading = false;
    this.selectedPayment=null;

  }

  selectCar(index) {
    this.selectedCar = this.payments[index].car;
    this.selectedPayment = this.payments[index];
    this.selectedIndex = index;
  }

  ngOnInit() {
   
  }

  ionViewWillEnter() {
    
  }

  ngOnChanges(changes) {
    if (changes.payments && this.payments.length) {
      this.selectedIndex = 0;
      if (this.payments.length) {
        this.selectedPayment = this.payments[this.selectedIndex];
        this.selectedCar =  this.selectedPayment.car;
      }
    }
  }

  ngAfterViewInit() {
  }

  addCar() {
    this.router.navigate(['/dashboard/select-car'])
  }



}
