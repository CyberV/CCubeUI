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


  get filteredCities() {
    if (!this.city || this.city == "") {
      return this.options;
    } else {
      return this.citiesService.findMatchingCities(this.city);
    }
  }

  get filteredStates() {
    if (!this.state || this.state === "") {
      return this.states;
    } else {

      return this.citiesService.findMatchingStates ? this.citiesService.findMatchingStates(this.state) : this.states;
    }
  }


  constructor(
    private citiesService: CitiesService
  ) {

    this.city = "";
    this.disabled = false;
    this.showState = false;
    this.options = citiesService.getAllCities();
    this.states = citiesService.states;
    this.mandatory = false;
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

  onEnterKey(e) {
    this.enterKey.emit();
  }

  selectCity(city) {
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
