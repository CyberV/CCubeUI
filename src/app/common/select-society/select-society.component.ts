
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { CitiesService } from 'app/cities.service';

import {scrollElementToTop} from 'app/util/util';

declare var $;
@Component({
  selector: 'select-society',
  templateUrl: './select-society.component.html',
  styleUrls: ['./select-society.component.scss'],
})
export class SelectSocietyComponent implements OnInit {

  @Input() city:string;
  @Input() society: string;
  other: string;

  @Output() societyChange = new EventEmitter()
  @Output() enterKey = new EventEmitter();

  @ViewChildren('inpSociety') inpSociety: QueryList<HTMLElement>;

  @ViewChildren('inpOther') inpOther: QueryList<HTMLElement>;
  
  @Input() mandatory:boolean;

  @Input() disabled: boolean;
  @Input() showOther: boolean;

  options: any;
  states: any;

  select = 'Select Society';

  unlisted:boolean;

  get filteredSocieties() {
    if (!this.select || this.select == "" || this.select == 'Select Society' || this.select == 'Other') {
      return this.options;
    } else {
      let records = this.citiesService.findMatchingSocieties(this.select, this.city);

      //this.unlisted = records.length == 0;
      return records;
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
    //console.log(d, this.society);
  }

  showUnlisted() {
    this.select = 'Other';
    this.unlisted = true;
    this.focus(true);
  }

  
  focus(other=false) {
    
    let inp:any = other? this.inpOther.first : this.inpSociety.first;
    if (inp) {

      if (inp.nativeElement) {
        setTimeout(()=> {
          inp.nativeElement.focus();
        }, 200);
        
      } else {
        setTimeout(()=> {
          inp.focus();
        }, 400);
      }

    }
  }

  onEnterKey(e) {
    if (typeof this.society === 'object') {
      let soc:any = this.society;
      this.society = soc.name;
    }
    
    this.enterKey.emit();
  }


  selectSociety(society ,unlisted = false) {
    this.society = society;
    this.unlisted = unlisted;
    this.societyChange.emit(society);


  }

}
