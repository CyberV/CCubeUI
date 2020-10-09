import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CitiesService } from 'app/cities.service';

@Component({
  selector: 'select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss'],
})
export class SelectCityComponent implements OnInit {

  @Input() city:string;
  @Input() state:string;

  @Output() cityChange = new EventEmitter();
  @Output() stateChange = new EventEmitter();

  @Input() disabled:boolean;
  @Input() showState:boolean;

  options:any;
  states:any;


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
    private citiesService:CitiesService
  ) {

    this.city = "";
    this.disabled = false;
    this.showState = false;
    this.options = citiesService.getAllCities();
    this.states = citiesService.states;
   }

  ngOnInit() {
    this.selectCity(this.city);
  }

  selectCity(city) {
    this.cityChange.emit(city);
    let found = this.citiesService.findStateForCity(city);

    if (found) {
      this.selectState(found);
    }
  }

  selectState(state) {
    this.state = state;
    this.stateChange.emit(state);
  }

}
