import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Query, QueryList, ViewChildren } from '@angular/core';
import { CitiesService } from 'app/cities.service';
import { scrollElementToTop } from 'app/util/util';

@Component({
  selector: 'select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss'],
})
export class SelectCityComponent implements OnInit {

  @Input() city: string;
  @Input() error: string;
  @Input() state: string;
  @Input() mandatory: boolean;


  @Output() cityChange = new EventEmitter();
  @Output() stateChange = new EventEmitter();
  @Output() enterKey = new EventEmitter();


  @Input() disabled: boolean;
  @Input() showState: boolean;

  @ViewChildren('inpState') inpState: QueryList<HTMLElement>;
  @ViewChildren('inpCity') inpCity: QueryList<HTMLElement>;

  options: any;
  states: any;
  hasError:boolean;


  get filteredCities() {
    if (!this.select || this.select == "") {
      return this.options;
    } else {
      return this.citiesService.findMatchingCities(this.select);
    }
  }

  get filteredStates() {
    if (!this.state || this.state === "") {
      return this.states;
    } else {

      return this.citiesService.findMatchingStates ? this.citiesService.findMatchingStates(this.state) : this.states;
    }
  }

  select:string;
  isSelected:boolean;

  constructor(
    private citiesService: CitiesService
  ) {

    this.city = "";
    this.disabled = false;
    this.showState = false;
    this.options = citiesService.getAllCities();
    this.states = citiesService.states;
    this.hasError = false;
    this.mandatory = false;
    this.select = "Select City";
    this.isSelected = false;
  }

  ngOnInit() {
    this.selectCity(this.city);
  }

  focus() {
    let inp: any = this.inpCity.first;

    if (inp) {

      inp.nativeElement.focus();

      //scrollElementToTop(inp.nativeElement);
    }
  }

  clearText() {
    this.onChange("");
  }

  onEnterKey(e) {
    this.enterKey.emit();
  }

  ngOnChanges(changes) {
    if (this.error && this.error.length) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }


  onBlur(e) {
    console.log(e);

    setTimeout(()=> {

      if (!this.isSelected && this.select.length > 0) {
        this.selectCity(this.city);
      }
    }, 100);

  }

  onChange(key) {

    this.select = key;
    this.isSelected = false;

  }
  selectCity(city) {
    this.city = city;
    this.isSelected = true;
    this.select = city;
    this.cityChange.emit(city);
    if (this.showState) {
      let found = this.citiesService.findStateForCity(city);

      if (found) {
        this.selectState(found);
      }
    }

  }

  selectState(state) {
    this.state = state;
    this.stateChange.emit(state);
  }

}
