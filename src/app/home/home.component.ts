import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  startShow:boolean = false;
  doorstep:boolean = false;
  knowmore:boolean = false;
  daily:boolean = false;
  demo:boolean = false;
  contact: boolean = false;

  interval:any;


  @ViewChildren('attention') attention : QueryList<ElementRef>;

  constructor() { }

  ngOnInit() {
    setTimeout(()=> {
      this.startShow=true;
    }, 1000);
  }

  loadMore() {
    this.knowmore = true;

    setTimeout(()=> {
      this.demo = true;

      setTimeout(()=> {
        this.contact = true;
        this.grabAttention();
      }, 1000)
    }, 1000)
  }

  grabAttention() {
    this.interval = setInterval(()=> {
      console.log(this.attention.first.nativeElement.className.replace);
      this.attention.first.nativeElement.className = this.attention.first.nativeElement.className.replace('animate__backInLeft','');
      this.attention.first.nativeElement.className = this.attention.first.nativeElement.className.replace(' animate__heartBeat','');
      setTimeout(() => {
        this.attention.first.nativeElement.className += ' animate__heartBeat';
      },100);
      
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
