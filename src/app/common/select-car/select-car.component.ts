import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import carsList from 'assets/carslist.json';


@Component({
  selector: 'select-car',
  templateUrl: './select-car.component.html',
  styleUrls: ['./select-car.component.scss'],
})
export class SelectCarComponent implements OnInit {

  @Output() letsgo = new EventEmitter();

  maker: string;
  model: string;

  lstMakers: any;

  makerSelected: boolean;
  modelSelected: boolean;

  selected:any;

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
      })
    } else  {
      return mkr.cars;
    }
  }

  constructor() {
      this.maker="";
      this.model="";
      this.makerSelected = false;
      this.modelSelected = false;
      this.selected = {};

      this.lstMakers = carsList.map((brand) => {
        return { name: brand.maker.toLowerCase(), logo: brand.logo };
      });

   }

   selectMaker(mkr) {
    this.maker = mkr.name.toUpperCase();
    this.makerSelected = true;
    this.selected.maker = carsList.filter( (maker) => {
      return maker.maker.toLowerCase() == this.maker.toLowerCase()
    })[0];
   }

   selectModel(mdl) {
    this.model = mdl.model.toUpperCase();
    this.modelSelected = true;
    this.selected.model = this.selected.maker.cars.filter( (car) => {
      return car.model.toLowerCase() == this.model.toLowerCase()
    })[0];
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
