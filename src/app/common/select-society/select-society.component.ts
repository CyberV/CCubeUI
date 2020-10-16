
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CitiesService } from 'app/cities.service';

@Component({
  selector: 'select-society',
  templateUrl: './select-society.component.html',
  styleUrls: ['./select-society.component.scss'],
})
export class SelectSocietyComponent implements OnInit {

  @Input() city:string;
  @Input() society: string;
  other: string;

  @Output() societyChange = new EventEmitter();

  @Input() mandatory:boolean;

  @Input() disabled: boolean;
  @Input() showOther: boolean;

  options: any;
  states: any;

  unlisted:boolean;

  get filteredSocieties() {
    if (!this.society || this.society == "") {
      return this.options;
    } else {
      let records = this.citiesService.findMatchingSocieties(this.society, this.city);

      this.unlisted = records.length == 0;
      return 
    }
  }




  constructor(
    private citiesService: CitiesService
  ) {

    this.city="faridabad";
    this.society = "";
    this.disabled = false;
    this.unlisted = false;
    this.mandatory = false;
    this.showOther = false;
    this.states = citiesService.states;
  }

  ngOnInit() {
    this.selectSociety(this.society);
    this.options = this.citiesService.getSocietiesForCity(this.city);
  }

  demo(d) {
    console.log(d, this.society);
  }

  selectSociety(society) {
    this.society = society.name;
    this.societyChange.emit(society.name);
    if (this.showOther) {
     
    }

  }

}
