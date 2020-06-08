import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements OnInit {

  @Input() value:string;
  @Input()  unit:string;
  @Input() symbol: string;
  @Input() title:string;


  constructor() {

    this.title = "Vital Name";
    this.symbol = "^";
    this.value="100";
    this.unit= "units";
   }

  ngOnInit() {}

}
