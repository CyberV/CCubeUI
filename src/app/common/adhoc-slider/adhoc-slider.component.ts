import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CarService } from 'app/services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'adhoc-slider',
  templateUrl: './adhoc-slider.component.html',
  styleUrls: ['./adhoc-slider.component.scss'],
})
export class AdhocSliderComponent implements OnInit {

  @Input() adhocs:any;
  @Input() selectedAdhocs:any;
  @Output() adhocSelected = new EventEmitter();
  @Input() active:boolean;

  isSelected(adhoc) {
    return this.adhocMap.indexOf(adhoc.name) > -1;
  }

  options = {
    centeredSlides: false,
    slidesPerView: 2.5,
    spaceBetween: 15,
  };

  adhocMap:any;

  constructor(
    private carService:CarService,
    private router:Router
  ) {
    this.active = false;
    this.adhocs = [
      {
        name:'Dry Cleaning',
        description: 'Try Dry Cleaning today to notice the visible difference.',
        rating: 4.5,
        price: 200,
        icon: 'ppe'
      },
      {
        name:'Polishing',
        description: 'Try Polishing today to notice the visible difference.',
        rating: 4.5,
        price: 400,
        icon: 'sanitize'
      },
      {
        name:'Waxing',
        description: 'Try Waxing today to notice the visible difference.',
        rating: 4.5,
        price: 500,
        icon: 'screening'
      },
      {
        name:'Paint Protection',
        description: 'Try Paint Protection today to notice the visible difference.',
        rating: 4.5,
        price: 600,
        icon: 'solution'
      },
      {
        name:'Rust Protection',
        description: 'Try Rust Protection today to notice the visible difference.',
        rating: 4.5,
        price: 400,
        icon: 'doorstep'
      }
    ];

    this.selectedAdhocs = [];
    this.adhocMap = [];
   }

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.selectedAdhocs && this.selectedAdhocs) {
      this.adhocMap = [];
      this.adhocMap = this.selectedAdhocs.map((adhoc) => {
        return adhoc.name;
      });
    }
  }

  selectAdhoc(adhoc) {
    this.adhocSelected.emit(adhoc);
    
  }

}
