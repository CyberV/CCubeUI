import { Component, OnInit, Output, EventEmitter, Input, ViewChild, QueryList } from '@angular/core';
import { scrollElementToTop } from 'app/util/util';
import { MatDatepicker, MatDatepickerToggle } from '@angular/material/datepicker';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {

  @Output() valueChange = new EventEmitter();


  @Input()
  value: any;

  @Input() readOnly:boolean;

  @Input() placeholder:string;
  @Input() minDate:any;
  @Input() maxDate:any;

  @Input() error:string;

  hasError:boolean;

  @ViewChild('phoneInput') phoneInput: QueryList<HTMLElement>;
  @ViewChild('dateToggle') dateToggle: QueryList<MatDatepickerToggle<any>>;

  


  constructor() {
    this.hasError = false;
    this.readOnly = false;
    this.placeholder = "";

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDate + 1);
    this.maxDate = new Date(currentYear, currentMonth + 1, currentDate);
   }

  ngOnInit() {}

  onPhoneChange(value) {
    this.value = new Date(value);
    this.valueChange.emit(this.value);
  }


  ngOnChanges(changes) {
    if (changes.error && this.error && this.error.length) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  
  focus() {
    let inp:any = this.phoneInput;

    

    if (inp) {
      scrollElementToTop(inp.nativeElement);
    }

    inp = this.dateToggle;

    inp.nativeElement.click();

    

  }

}
