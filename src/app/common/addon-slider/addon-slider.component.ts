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
  @Input() blockedAddons:any;
  @Output() addonSelected = new EventEmitter();
  @Input() active:boolean;
  @Input() plan:any;

  isSelected(addon) {
    return this.addonMap.indexOf(addon.code) > -1;
  }

  isBlocked(addon) {
    return this.blockedMap.indexOf(addon.code) > -1;
  }

  options = {
    centeredSlides: false,
    slidesPerView: 2.5,
    spaceBetween: 15,
  };

  addonMap:any;
  blockedMap:any;

  constructor(
    private carService:CarService,
    private router:Router,
    private planService:PlanService
  ) {
    this.active = false;
    this.bodyType = 'sedan';
    this.plan = null;

    this.addOns = this.planService.getAddonsForPlan('Standard');

    this.blockedAddons = [];
    this.selectedAddons = [];
    this.addonMap = [];
    this.blockedMap = [];
   }

  ngOnInit() {}

  ngOnChanges(changes) {

    if (changes.plan && this.plan) {
      this.addOns = this.planService.getAddonsForPlan(this.plan.name);
    }

    if (changes.selectedAddons && this.selectedAddons) {
      this.addonMap = [];
      this.addonMap = this.selectedAddons.map((addon) => {
        return addon.code;
      });

      this.parse();
    }

    if (changes.bodyType && this.bodyType && this.addOns) {
      for (let i=0;i< this.addOns.length; i++) {
        this.addOns[i].price = this.addOns[i].pricing[this.bodyType];
      }
    }

    if (changes.blockedAddons && this.blockedAddons) {
      console.log('Blocked', this.blockedAddons);
      this.blockedMap = this.blockedAddons.map((a) => a.code);
      this.parse();
    }
  }

  parse() {
    let added = [];
    let blocked = [];
    let available = [];

    this.addOns.forEach( (adn)=> {

      if (this.isSelected(adn)) {
        added.push(adn);
      } else if (this.isBlocked(adn)) {
        blocked.push(adn);
      } else {
        available.push(adn);
      }

    });


    Array.prototype.push.apply(added, available);

    Array.prototype.push.apply(added, blocked);

    this.addOns = added;
  }

  selectAddon(addon) {
    this.addonSelected.emit(addon);
    
  }

}
