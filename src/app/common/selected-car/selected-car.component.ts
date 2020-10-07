import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'selected-car',
  templateUrl: './selected-car.component.html',
  styleUrls: ['./selected-car.component.scss'],
})
export class SelectedCarComponent implements OnInit {

  @Input() car:any;
  @Output() compare = new EventEmitter();
  @Output() changeCar = new EventEmitter();

  showLink: boolean = false;

  constructor() { }

  onCompare() {
    this.changeCar.emit();
  }

  onChangeCar() {
    this.changeCar.emit();
  }

  ngOnInit() {}

}
