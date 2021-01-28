import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'selected-car',
  templateUrl: './selected-car.component.html',
  styleUrls: ['./selected-car.component.scss'],
})
export class SelectedCarComponent implements OnInit {

  @Input() car:any;
  @Output() compare = new EventEmitter();
  @Output() changeCar = new EventEmitter();
  @Input() hideRemove:boolean;
  @Input() slim:boolean;

  showLink: boolean = false;

   displayType:string;

  constructor() {
    this.hideRemove = false;
    this.slim = false;
   }

  onCompare() {
    this.changeCar.emit();
  }

  onChangeCar() {
    this.changeCar.emit();
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.car) {
      switch(this.car.bodyType.toLowerCase()) {
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
          this.displayType = this.car.displayType == 'crossover' ? 'Crossover' : 'Compact SUV';
          break;
        }
        case 'suv': {
          this.displayType = this.car.displayType == 'mpv' ? 'MPV' : 'SUV';
          break;
        }
        case 'luxury': {
          this.displayType = 'Luxury Car';
          break;
        }
        default:;
      }
    }
  }

}
