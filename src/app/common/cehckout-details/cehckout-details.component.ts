import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'checkout-details',
  templateUrl: './cehckout-details.component.html',
  styleUrls: ['./cehckout-details.component.scss'],
})
export class CheckoutDetailsComponent implements OnInit {

  @Input() plan:any;
  @Input() car:any;

  constructor() { }

  ngOnInit() {}

}
