import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mobile-input',
  templateUrl: './mobile-input.component.html',
  styleUrls: ['./mobile-input.component.scss'],
})
export class MobileInputComponent implements OnInit {

  @Output() valueChange = new EventEmitter();
  @Output() blur = new EventEmitter();


  @Input()
  value: any;

  @Input()
  type: string;

  @Input() name:string;
  @Input() placeholder:string;
  @Input() uppercase:boolean;
  @Input() readonly: boolean;

  constructor() {
    this.name="Input";
    this.placeholder="";
    this.type = "number";
    this.uppercase = false;
    this.readonly = false;
   }

  onPhoneChange(value) {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  ngOnInit() {
    
  }

  sendBlur(value){
    this.blur.emit(value);
  }

}
