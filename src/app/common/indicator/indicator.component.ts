import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss'],
})
export class IndicatorComponent implements OnInit {

  @Input() title:string;
  @Input() symbol:string;
  @Input() size: number;

  constructor() { 

    this.title="Title";
    this.symbol="T";
    this.size = 70;
  }

  ngOnInit() {}

}
