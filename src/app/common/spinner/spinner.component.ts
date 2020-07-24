import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {

  @Input() color:string;

  classMap:any;

  constructor() {
    this.color = '';


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
