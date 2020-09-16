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
  @Input() error:string;

  @Input() labelOnly:boolean;
  @Input() inputOnly:boolean;

  @Input() uppercase:boolean;
  @Input() readonly: boolean;

  hasError:boolean;

  constructor() {
    this.name="Input";
    this.placeholder="";
    this.type = "number";
    this.uppercase = false;
    this.readonly = false;
    this.labelOnly = false;
    this.inputOnly = false;

    this.hasError = false;
   }

  onPhoneChange(value) {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes) {
    if (changes.error && this.error.length) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  sendBlur(value){
    this.blur.emit(value);
  }

}
