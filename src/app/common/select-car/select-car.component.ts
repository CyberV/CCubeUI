import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import carsList from 'assets/carslist.json';
import { AccordionComponent } from '../accordion/accordion.component';
import {scrollElementToTop} from 'app/util/util';


@Component({
  selector: 'select-car',
  templateUrl: './select-car.component.html',
  styleUrls: ['./select-car.component.scss'],
})
export class SelectCarComponent implements OnInit {

  @Output() letsgo = new EventEmitter();

  @Output() carSelected = new EventEmitter();

  maker: string;
  model: string;

  lstMakers: any;

  makerSelected: boolean;
  modelSelected: boolean;

  selected:any;

  options:any;

  get makerLabel() {
    return this.maker === '' ? 'Select Maker' : 'Maker : ' + this.maker; 
  }
  
  get modelLabel() {
    return this.model === '' ? 'Select Model' : 'Model : ' + this.model; 
  }

  get filteredMakers() {
    if (this.maker.length) {
      return this.lstMakers.filter( (mkr) => {
        return mkr.name.indexOf(this.maker.toLowerCase()) > -1
      });
    } else  {
      return this.lstMakers;
    }

  }

  get filteredModels() {
    let  mkr = this.selected.maker;
    if (this.model.length) {
      return mkr.cars.filter( (car) => {
        return  car.model.toLowerCase().indexOf(this.model.toLowerCase()) > -1
      });
    } else  {
      return mkr.cars;
    }
  }

  @ViewChild('modelDrawer') modelDrawer : AccordionComponent;
  @ViewChild('makerDrawer') makerDrawer : AccordionComponent;

  constructor() {
      this.maker="";
      this.model="";
      this.makerSelected = false;
      this.modelSelected = false;
      this.selected = {};

      this.lstMakers = carsList.map((brand) => {
        return { name: brand.maker.toLowerCase(), logo: brand.logo };
      });

      this.options = {
        initialSlide: 0,
        centeredSlides: true,
      slidesPerView: 1,
        
        
      }

   }

   selectMaker(mkr) {
    this.maker = mkr.name.toUpperCase();
    this.makerSelected = true;
    this.selected.maker = carsList.filter( (maker) => {
      return maker.maker.toLowerCase() == this.maker.toLowerCase()
    })[0];


    setTimeout( ()=> {
      this.makerDrawer.toggle();
      setTimeout( ()=> {
        this.modelDrawer.toggle();
        this.modelDrawer.drawerToggle.nativeElement.scrollIntoView();
      }, 500)
    }, 500);
   }

   onModelToggle(isOpen) {
    console.log('Model Opened', isOpen);
    // this.maker
    // scrollElementToTop()
   }

   onMakerToggle(isOpen) {
    console.log('Maker Opened', isOpen);

   }

   displayType:string;

   selectModel(mdl) {
    this.model = mdl.model.toUpperCase();
    this.modelSelected = true;
    this.selected.model = this.selected.maker.cars.filter( (car) => {
      return car.model.toLowerCase() == this.model.toLowerCase()
    })[0];

    this.carSelected.emit( {
      maker: this.maker,
      model: this.model,
      bodyType: this.selected.model.bodyType
    });

    switch(this.selected.model.bodyType.toLowerCase()) {
      case 'hatchback': {
        this.displayType = 'Hatchback';
        break;
      }
      case 'phatchback': {
        this.displayType = 'Premium Hatchback';
        break;
      }
      case 'sedan': {
        this.displayType = 'Sedan';
        break;
      }
      case 'csuv': {
        this.displayType =  'Compact SUV';
        break;
      }
      case 'suv': {
        this.displayType = 'SUV';
        break;
      }
      case 'luxury': {
        this.displayType = 'Luxury Car';
        break;
      }
      default:;
    }


    setTimeout( ()=> {
      this.modelDrawer.toggle(false);
    }, 500);

   }

   submit() {
     let bodyType = this.selected.model.bodyType;
     this.letsgo.emit({
       maker: this.maker,
       model: this.model,
       bodyType: bodyType
     })
   }

  ngOnInit() {}

}
