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

  @Input() bodyType:string;
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
    this.bodyType = 'sedan';

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

    if (changes.bodyType && this.bodyType && this.addOns) {
      for (let i=0;i< this.addOns.length; i++) {
        this.addOns[i].price = this.addOns[i].pricing[this.bodyType];
      }
    }
  }

  selectAddon(addon) {
    this.addonSelected.emit(addon);
    
  }

}
