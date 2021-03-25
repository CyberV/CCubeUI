import { Component, OnInit, Input } from '@angular/core';
import { whitesmoke } from 'color-name';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {

  @Input() color:string;
  @Input() slim:boolean;
  @Input() width:number; /// in px

  classMap:any;

  constructor() {
    this.color = '';
    this.slim = false;
    this.width = 0;


   }

  ngOnInit() {

  }

  ngOnChanges() {
    const { color } = this;
    this.classMap = {
      'text-light': color == '',
      'text-primary': color == 'blue'
    };
  }

}
