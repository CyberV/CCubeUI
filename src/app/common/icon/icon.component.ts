import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {


  @Input()
  name:string;

  @Input()
  size: number;

  constructor() {
    this.name = "search";
    this.size = 1;
  }

  ngOnInit() {
  }

}
