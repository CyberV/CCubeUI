import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mobile-input',
  templateUrl: './mobile-input.component.html',
  styleUrls: ['./mobile-input.component.scss'],
})
export class MobileInputComponent implements OnInit {

  @Output() numberChange = new EventEmitter();


  @Input()
  number: number;
  constructor() { }

  onPhoneChange(number) {
    this.number = number;
    this.numberChange.emit(this.number);
  }

  ngOnInit() {}

}
