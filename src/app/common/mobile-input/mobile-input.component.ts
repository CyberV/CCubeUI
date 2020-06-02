import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mobile-input',
  templateUrl: './mobile-input.component.html',
  styleUrls: ['./mobile-input.component.scss'],
})
export class MobileInputComponent implements OnInit {

  @Output() valueChange = new EventEmitter();


  @Input()
  value: any;

  @Input()
  type: string;

  @Input() name:string;
  @Input() placeholder:string;

  constructor() {
    this.name="Input";
    this.placeholder="";
    this.type = "number";
   }

  onPhoneChange(value) {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  ngOnInit() {
    
  }

}
