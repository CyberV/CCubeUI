import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'app/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks-page.component.html',
  styleUrls: ['./thanks-page.component.scss'],
})
export class ThanksPageComponent implements OnInit {

  constructor(private headerService:HeaderService, private router:Router) { }

  public context: string;

  payment:any;

  get startDate()  {

    return this.payment ? new Date(this.payment.startDate).toLocaleString() : null;
  }

  ngOnInit() {

    this.context = "thanks";
    this.payment = {};
  }

  ionViewWillEnter() {
    this.payment = JSON.parse(sessionStorage.getItem('currentPayment'));
    this.headerService.setText('Plan Purchased!');

    sessionStorage.removeItem('currentCar');

    setTimeout( () => {
      this.goToDashboard();
    }, 10000); 
  }


  goToDashboard() {
    this.router.navigate(['/dashboard/service']);
  }
}
