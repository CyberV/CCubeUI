import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cc-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() title:string;
  @Input() step:string;

  @Input() compact: boolean;

  hasStep:boolean;

  constructor() {

    this.title = '';
    this.step = '';
    this.compact = false;
    this.hasStep = false;
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.hasStep = !! (this.step && this.step.length)
  }

}
