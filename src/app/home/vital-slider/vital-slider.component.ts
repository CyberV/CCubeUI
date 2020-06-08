import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vital-slider',
  templateUrl: './vital-slider.component.html',
  styleUrls: ['./vital-slider.component.scss'],
})
export class VitalSliderComponent implements OnInit {

  constructor() { }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
    }
  };

  ngOnInit() {}

}
