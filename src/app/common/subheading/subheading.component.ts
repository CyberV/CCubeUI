import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'subheading',
  templateUrl: './subheading.component.html',
  styleUrls: ['./subheading.component.scss'],
})
export class SubheadingComponent implements OnInit {

  @Input() text:string;
  @Input() color:string;
  @Input() size:number;
  @Input() align:string;

  @Input() slim:boolean

  constructor() {
    this.text="";
    this.color="#bcbcbc";
    this.align ="left";
    this.size = 16;
    this.slim = false;
  }

  ngOnInit() {}

}
