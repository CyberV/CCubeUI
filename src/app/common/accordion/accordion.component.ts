import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'cc-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() title:string;
  @Input() step:string;
  @Input() error:boolean;

  @Input() compact: boolean;
  @Input() disabled:boolean;
  @Input() locked:boolean;

  @ViewChild('drawerToggle') drawerToggle: ElementRef;

  hasStep:boolean;

  constructor() {

    this.title = '';
    this.step = '';
    this.compact = false;
    this.hasStep = false;
    this.disabled = false;
    this.error = false;
    this.locked = false;
  }

  ngOnInit() {

  }

  toggle() {
    this.drawerToggle.nativeElement.click();
  } 

  ngOnChanges(changes) {
    this.hasStep = !! (this.step && this.step.length);
    console.log('disabled', this.disabled);
  }

}
