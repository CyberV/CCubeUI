import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  toggle() {
    this.action.emit('asd');
  }

}
