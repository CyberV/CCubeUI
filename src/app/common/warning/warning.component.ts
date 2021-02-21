import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss'],
})
export class WarningComponent implements OnInit {

  constructor() {
    this.text = "warning";
   }

  @Input() text:string;

  ngOnInit() {}

}
