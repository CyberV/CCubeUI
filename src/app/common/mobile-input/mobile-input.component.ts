import { Component, OnInit, Input, Output, EventEmitter, ViewChild, QueryList } from '@angular/core';
import {scrollElementToTop} from 'app/util/util';

declare var $;
@Component({
  selector: 'mobile-input',
  templateUrl: './mobile-input.component.html',
  styleUrls: ['./mobile-input.component.scss'],
})
export class MobileInputComponent implements OnInit {

  @Output() valueChange = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() enterKey = new EventEmitter();


  @Input()
  value: any;

  @Input()
  type: string;

  @Input() name:string;
  @Input() placeholder:string;
  @Input() error:string;

  @Input() labelOnly:boolean;
  @Input() inputOnly:boolean;
  @Input() mandatory:boolean;

  @Input() constraints:any;

  @Input() uppercase:boolean;
  @Input() readonly: boolean;

  @ViewChild('phoneInput') phoneInput: QueryList<HTMLElement>;

  hasError:boolean;

  constructor() {
    this.name="Input";
    this.placeholder="";
    this.type = "number";
    this.uppercase = false;
    this.readonly = false;
    this.labelOnly = false;
    this.inputOnly = false;
    this.mandatory = false;

    this.hasError = false;
    this.constraints = {
      min: '',
      max: ''
    };
   }

  onPhoneChange(value) {
    this.value = value.trim();
    this.valueChange.emit(this.value);
  }

  onEnterKey(e) {
    this.enterKey.emit();
  }

  clearText() {
    this.onPhoneChange("");
  }

  focus() {
    let inp:any = this.phoneInput;

    if (inp) {
      scrollElementToTop(inp.nativeElement);
    }

    

  }

  ngOnInit() {
    
  }

  ngOnChanges(changes) {
    if (this.error && this.error.length) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  sendBlur(value){
    this.blur.emit(value);
  }

}
