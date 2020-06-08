import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements OnInit {

  selectedVital:any;
  
  constructor() { }

  ngOnInit() {}

}
