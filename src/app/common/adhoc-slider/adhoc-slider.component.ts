import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CarService } from 'app/services/car.service';
import { Router } from '@angular/router';
import { PlanService } from 'app/services/plan.service';
import { IonSlides } from '@ionic/angular';
import { getConfigValue } from '../common.service';

@Component({
  selector: 'adhoc-slider',
  templateUrl: './adhoc-slider.component.html',
  styleUrls: ['./adhoc-slider.component.scss'],
})
export class AdhocSliderComponent implements OnInit {

  @Input() bodyType: string;
  @Input() adhocs: any;
  @Input() selectedAdhocs: any;
  @Input() subscriptionAdhocs: any;
  @Input() active: boolean;
  @Input() plan: any;
  @Input('blockedAdhocs') blockedAddons: any;

  @Output() showDetails = new EventEmitter();
  @Output() adhocSelected = new EventEmitter();
  @Output() reschedule = new EventEmitter();


  isSelected(adhoc) {
    return this.adhocMap.indexOf(adhoc.code) > -1;
  }

  @ViewChild('adnSlider') adnSlider: IonSlides;

  isBlocked(addon) {
    return this.blockedMap.indexOf(addon.code) > -1;
  }

  isSchedulable(addon) {
    return addon.isAdhoc;
  }

  isSmallText(addon) {
    let t = addon.label || addon.name;

    return t.length <= 11;
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
    spaceBetween: 20,
  };

  blockedMap: any;
  dateMap: any;

  adhocMap: any;
  showAnimation: boolean;

  constructor(
    private carService: CarService,
    private router: Router,
    private planService: PlanService
  ) {
    this.active = false;
    this.bodyType = 'sedan';
    this.showAnimation = false;
    this.blockedAddons = [];
    this.subscriptionAdhocs = [];
    this.adhocs = [
      {
        name: 'Deep Wash in a shop',
        label: 'Deep Wash in Shop',
        description: 'Try Deep Wash today to notice the visible difference.',
        rating: 4.5,
        price: 200,
        icon: 'ppe'
      },
      {
        name: 'Full Body Wash',
        description: 'Try Full Body Wash today to notice the visible difference.',
        rating: 4.5,
        price: 400,
        icon: 'sanitize'
      }
    ];
    this.discountConfig = getConfigValue('INBUILTDISCOUNT_CONFIG');
    this.selectedAdhocs = [];
    this.adhocMap = [];
    this.blockedMap = [];
    this.adhocMap = [];
    this.dateMap = [];
  }

  discountConfig:any;

  ngOnInit() {
    this.adhocs = this.planService.getAdhocsForPlan(this.plan ? this.plan.name : 'Standard');
    this.updatePrice();
    this.parse();
  }

  sendShowDetails(addon) {

    if (!this.isBlocked(addon)) {
      this.showDetails.emit(addon);
    }


  }

  sendReschedule(addon) {
    let found = this.subscriptionAdhocs.filter((adh) => adh.addon.code == addon.code);

    if (found.length) {
      found = found[0];
      this.reschedule.emit(found);
    }

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

  parse() {
    let added = [];
    let blocked = [];
    let available = [];

    this.adhocs.forEach((adn) => {

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

    this.adhocs = added;
  }

  ngOnChanges(changes) {


    if (changes.subscriptionAdhocs && this.subscriptionAdhocs) {
      this.dateMap = this.subscriptionAdhocs.map((adn) => {
        return {
          code: adn.addon.code,
          date: new Date(adn.scheduledTime).toString().split(' ').slice(1, 3).join(' ')
        };
      })
    }

    if (changes.selectedAdhocs && this.selectedAdhocs) {
      if (this.adnSlider) {
        this.adnSlider.stopAutoplay();
      }
      this.adhocMap = [];
      this.adhocMap = this.selectedAdhocs.map((addon) => {
        return addon.code;
      });

      this.parse();
    }

    if (changes.blockedAddons && this.blockedAddons && this.blockedAddons.length) {
      console.log('Blocked', this.blockedAddons);
      this.blockedMap = this.blockedAddons.map((a) => a.code);
      this.parse();

    }

    if (changes.bodyType && this.bodyType && this.adhocs) {
      this.updatePrice();
    }



    if (changes.plan && this.plan) {
      this.adhocs = this.planService.getAdhocsForPlan(this.plan ? this.plan.name : 'Standard');
      this.updatePrice();
    }
  }


  updatePrice() {

    if (this.bodyType && this.adhocs && this.adhocs.length && this.adhocs[0].pricing) {
      for (let i = 0; i < this.adhocs.length; i++) {
        this.adhocs[i].price = this.adhocs[i].pricing[this.bodyType];

        if (this.plan && this.discountConfig && this.discountConfig.addon && this.discountConfig.addon.withPlan) {
          this.adhocs[i].originalPrice = this.adhocs[i].price;
          this.adhocs[i].withPlan = true;
          this.adhocs[i].price -= this.discountConfig.addon.withPlan;
        } else {
          this.adhocs[i].withPlan = false;
          this.adhocs[i].originalPrice = null;
        }
      }
    }
  }

  selectAdhoc(adhoc) {
    this.adhocSelected.emit(adhoc);
  }

}
