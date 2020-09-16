import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'cc-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() title:string;
  @Input() step:string;

  @Input() compact: boolean;

  @ViewChild('drawerToggle') drawerToggle: ElementRef;

  hasStep:boolean;

  constructor() {

    this.title = '';
    this.step = '';
    this.compact = false;
    this.hasStep = false;
  }

  ngOnInit() {

  }

  toggle() {
    this.drawerToggle.nativeElement.click();
  } 

  ngOnChanges() {
    this.hasStep = !! (this.step && this.step.length)
  }

}
