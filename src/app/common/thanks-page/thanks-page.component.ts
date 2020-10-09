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

  ngOnInit() {

    this.context = "thanks";
  }

  ionViewWillEnter() {
    this.headerService.setText('Plan Purchased!');
  }


  goToDashboard() {
    this.router.navigate(['/dashboard/service']);
  }
}
