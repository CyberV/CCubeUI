import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
})
export class HeadingComponent implements OnInit {

  @Input() text:string;
  @Input() color:string;
  @Input() size:number;
  @Input() align:string;

  constructor() {
    this.align='left';
    this.text='';
    this.color='black';
    this.size= 20;
   }

  ngOnInit() {}

}
