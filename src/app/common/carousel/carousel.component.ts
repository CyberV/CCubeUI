import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonSlides } from '@ionic/angular';


declare var $;
@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {

  @Output() slideChange = new EventEmitter();
  @Output() skip = new EventEmitter();

  currentIndex : number;
  constructor() {
    this.options = {
      autoplay: false,
      centeredSlides: true,
    slidesPerView: 1,
    // spaceBetween: 0,
    };
    this.currentIndex = 0;
   }

  @ViewChild('carousel') carousel: IonSlides;

  options:any;

  ngOnInit() {}
  ngAfterViewInit() {


     
    
    this.carousel.ionSlideWillChange.subscribe((a,b ,c) => {
      //console.log('Slide Change' , a, b, c);
      this.carousel.getActiveIndex().then((i) => {
        this.currentIndex = i;
        this.slideChange.emit(this.currentIndex);
      })
      
    })
  }

  sendSkip() {
    this.skip.emit();
    
  }

  nextSlide() {
    this.carousel.slideNext();
  }

  previousSlide() {
    this.carousel.slidePrev();
  }


}
