import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'app/header.service';

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks-page.component.html',
  styleUrls: ['./thanks-page.component.scss'],
})
export class ThanksPageComponent implements OnInit {

  constructor(private headerService:HeaderService) { }

  public context: string;

  ngOnInit() {

    this.context = "thanks";
  }

  ionViewWillEnter() {
    this.headerService.setText('Plan Purchased!');
  }


  goToDashboard() {
    
  }
}
