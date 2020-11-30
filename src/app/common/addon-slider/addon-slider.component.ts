import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CarService } from 'app/services/car.service';
import { Router } from '@angular/router';
import { PlanService } from 'app/services/plan.service';

@Component({
  selector: 'addon-slider',
  templateUrl: './addon-slider.component.html',
  styleUrls: ['./addon-slider.component.scss'],
})
export class AddonSliderComponent implements OnInit {

  @Input() addOns:any;
  @Input() selectedAddons:any;
  @Output() addonSelected = new EventEmitter();
  @Input() active:boolean;

  isSelected(addon) {
    return this.addonMap.indexOf(addon.name) > -1;
  }

  options = {
    centeredSlides: false,
    slidesPerView: 2.5,
    spaceBetween: 15,
  };

  addonMap:any;

  constructor(
    private carService:CarService,
    private router:Router,
    private planService:PlanService
  ) {
    this.active = false;
    // this.addOns = [
    //   {
    //     name:'Dry Cleaning',
    //     description: 'Try Dry Cleaning today to notice the visible difference.',
    //     rating: 4.5,
    //     price: 200,
    //     icon: 'ppe'
    //   },
    //   {
    //     name:'Polishing',
    //     description: 'Try Polishing today to notice the visible difference.',
    //     rating: 4.5,
    //     price: 400,
    //     icon: 'sanitize'
    //   },
    //   {
    //     name:'Waxing',
    //     description: 'Try Waxing today to notice the visible difference.',
    //     rating: 4.5,
    //     price: 500,
    //     icon: 'screening'
    //   },
    //   {
    //     name:'Paint Protection',
    //     description: 'Try Paint Protection today to notice the visible difference.',
    //     rating: 4.5,
    //     price: 600,
    //     icon: 'solution'
    //   },
    //   {
    //     name:'Rust Protection',
    //     description: 'Try Rust Protection today to notice the visible difference.',
    //     rating: 4.5,
    //     price: 400,
    //     icon: 'doorstep'
    //   }
    // ];

    this.addOns = this.planService.getAddonsForPlan('Standard');

    this.selectedAddons = [];
    this.addonMap = [];
   }

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.selectedAddons && this.selectedAddons) {
      this.addonMap = [];
      this.addonMap = this.selectedAddons.map((addon) => {
        return addon.name;
      });
    }
  }

  selectAddon(addon) {
    this.addonSelected.emit(addon);
    
  }

}
