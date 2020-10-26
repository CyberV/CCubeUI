import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {

  @Input() color:string;
  @Input() slim:boolean;

  classMap:any;

  constructor() {
    this.color = '';
    this.slim = false;


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
