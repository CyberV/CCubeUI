import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'purchased-plan',
  templateUrl: './purchased-plan.component.html',
  styleUrls: ['./purchased-plan.component.scss'],
})
export class PurchasedPlanComponent implements OnInit {

  @Input() car:any;
  @Input() plan:any;

  @Output() compare = new EventEmitter();
  @Output() changeCar = new EventEmitter();

  showLink: boolean = false;

  expiryDate:string;

  constructor() { }

  onCompare() {
    this.changeCar.emit();
  }

  onChangeCar() {
    this.changeCar.emit();
  }

  ngOnInit() {
    this.expiryDate = new Date(+(new Date()) + 2592000000).toString().split(' ').slice(1,3).join(' ');

    let d = new Date();
    d.getMonth
  }

}
