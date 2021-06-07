import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CarService } from 'app/services/car.service';
import { Router } from '@angular/router';
import { PlanService } from 'app/services/plan.service';
import { IonSlides } from '@ionic/angular';
import { prettyDate } from 'app/util/util';
import { getConfigValue } from '../common.service';

@Component({
  selector: 'addon-slider',
  templateUrl: './addon-slider.component.html',
  styleUrls: ['./addon-slider.component.scss'],
})
export class AddonSliderComponent implements OnInit {

  @Input() bodyType: string;
  @Input() addOns: any;
  @Input() selectedAddons: any;
  @Input() blockedAddons: any;
  @Input() subscriptionAddons: any;

  @Output() addonSelected = new EventEmitter();
  @Output() showDetails = new EventEmitter();
  @Input() active: boolean;
  @Input() plan: any;

  @ViewChild('adnSlider') adnSlider: IonSlides;

  isSelected(addon) {
    return this.addonMap.indexOf(addon.code) > -1;
  }

  isBlocked(addon) {
    return this.blockedMap.indexOf(addon.code) > -1;
  }

  isSchedulable(addon) {
    return addon.isAdhoc;
  }

  isSmallText(addon) {
    let t = addon.label || addon.name;

    return t.length <= 13;
  }

  isScheduled(addon) {
    if (!this.dateMap.length) {
      return false;
    }
    let found = this.dateMap.filter((obj) => obj.code == addon.code);
    return found.length && found[0].date != "Date" ? found[0].date : false;
  }

  options = {
    centeredSlides: false,
    slidesPerView: 2.3,
    spaceBetween: 10,
  };

  showAnimation: boolean;

  addonMap: any;
  blockedMap: any;
  dateMap: any;
  discountConfig: any;

  constructor(
    private carService: CarService,
    private router: Router,
    private planService: PlanService
  ) {
    this.active = false;
    this.bodyType = 'sedan';
    this.plan = null;
    this.discountConfig = getConfigValue('INBUILTDISCOUNT_CONFIG');

    this.addOns = this.planService.getAddonsForPlan('Standard');

    this.blockedAddons = [];
    this.selectedAddons = [];
    this.addonMap = [];
    this.blockedMap = [];
    this.subscriptionAddons = [];
    this.dateMap = [];
    this.showAnimation = false;
  }

  ngOnInit() { }

  sendShowDetails(addon) {
    this.showDetails.emit(addon);
  }

  ngAfterViewInit() {
    this.animate();
  }

  animate() {
    this.showAnimation = false;
    setTimeout(() => {
      this.showAnimation = true;
      this.adnSlider ? this.adnSlider.startAutoplay() : '';
    }, 200);
  }

  pretty(addon) {
    return prettyDate(this.subscriptionAddons.filter((a) => a.addon.code == addon.code)[0].expiresOn);
  }

  ngOnChanges(changes) {

    if (changes.subscriptionAddons && this.subscriptionAddons) {
      this.dateMap = this.subscriptionAddons.map((adn) => {
        return {
          code: adn.addon.code,
          date: new Date(adn.scheduledTime).toString().split(' ').slice(1, 3).join(' ')
        };
      })
    }

    if (changes.plan && this.plan) {
      this.addOns = this.planService.getAddonsForPlan(this.plan.name);

      if (this.subscriptionAddons.length) {

      this.addOns = this.planService.getAddonsForPlan('Standard');
      }
      this.updatePrice();
    }

    if (changes.selectedAddons && this.selectedAddons) {
      if (this.adnSlider) {
        this.adnSlider.stopAutoplay();
      }
      this.addonMap = [];
      this.addonMap = this.selectedAddons.map((addon) => {
        return addon.code;
      });

      this.parse();
    }

    if (changes.blockedAddons && this.blockedAddons && this.blockedAddons.length) {
      console.log('Blocked', this.blockedAddons);
      this.blockedMap = this.blockedAddons.map((a) => a.code);
      this.parse();

    }

    if (changes.bodyType && this.bodyType && this.addOns) {
      this.updatePrice();
    }
  }

  updatePrice() {
    if (this.bodyType && this.addOns) {
      for (let i = 0; i < this.addOns.length; i++) {
        this.addOns[i].price = this.addOns[i].pricing[this.bodyType];
        if (this.plan && this.discountConfig && this.discountConfig.addon && this.discountConfig.addon.withPlan) {
          this.addOns[i].originalPrice = this.addOns[i].price;
          this.addOns[i].withPlan = true;
          this.addOns[i].price -= this.discountConfig.addon.withPlan;
        } else {
          this.addOns[i].withPlan = false;
          this.addOns[i].originalPrice = null;
        }

      }
    }
  }

  parse() {
    let added = [];
    let blocked = [];
    let available = [];

    this.addOns.forEach((adn) => {

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
