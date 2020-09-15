import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'selected-car',
  templateUrl: './selected-car.component.html',
  styleUrls: ['./selected-car.component.scss'],
})
export class SelectedCarComponent implements OnInit {

  @Input() car:any;

  constructor() { }

  ngOnInit() {}

}
