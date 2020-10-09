import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
})
export class ServicePageComponent implements OnInit {

  @Input() payments: any;
  constructor() { 
    this.payments = [];
  }

  ngOnInit() {}



}
