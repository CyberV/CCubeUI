import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {

  private styleName:string;

  @ViewChild('field', {'static': false}) field:ElementRef;

  get styleSuffix() {
    return '--'+this.styleName;
  }

  get inputClass() {
    let obj={};
    if(this.field) {
      obj['input input' + this.styleSuffix]=true;
      obj['input--filled']= this.field.nativeElement.value.trim().length > 0;
    }
    
    return obj;
  }

  get fieldClass() {
    return '__field' + this.styleSuffix;
  }

  get labelClass() {
    return '__label' + this.styleSuffix;
  }

  get contentClass() {
    return 'input__label-content' + this.styleSuffix;
  }

  constructor() {
    this.styleName = "yoshiko";
  }

  ngOnInit() {}

}
