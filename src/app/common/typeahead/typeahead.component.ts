import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnInit {

  @Output() valueChange = new EventEmitter();


  @Input() value: any;

  @Input() type: string;

  @Input() choices: any;

  @Input() name:string;
  @Input() placeholder:string;

  constructor() {
    this.name="Input";
    this.placeholder="";
    this.type = "number";
    this.choices = [
      {
        label: 'Choice 1',
        logo: 'logo1'
      }
    ];

   }

  onPhoneChange(value) {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  ngOnInit() {
    
  }

}
