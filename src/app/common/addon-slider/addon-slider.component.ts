import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'addon-slider',
  templateUrl: './addon-slider.component.html',
  styleUrls: ['./addon-slider.component.scss'],
})
export class AddonSliderComponent implements OnInit {

  @Input() addOns:any;



  options = {
    centeredSlides: false,
    slidesPerView: 2.5,
    spaceBetween: 15,
  };

  constructor() {
    this.addOns = [
      {
        title:'Dry Cleaning',
        rating: 4.5,
        icon: 'ppe'
      },
      {
        title:'Polishing',
        rating: 4.5,
        icon: 'sanitize'
      },
      {
        title:'Waxing',
        rating: 4.5,
        icon: 'screening'
      },
      {
        title:'Paint Protection',
        rating: 4.5,
        icon: 'solution'
      },
      {
        title:'Rust Protection',
        rating: 4.5,
        icon: 'doorstep'
      },
        {
        title:'Dry Cleaning',
        rating: 4.5,
        icon: 'notification'
      }
    ]
   }

  ngOnInit() {}

}
