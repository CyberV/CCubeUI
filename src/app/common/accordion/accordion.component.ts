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
  @Input() defaultOpen:boolean;

  @ViewChild('drawerToggle') drawerToggle: ElementRef;

  hasStep:boolean;
  initDone:boolean;

  constructor() {

    this.title = '';
    this.step = '';
    this.compact = false;
    this.hasStep = false;
    this.disabled = false;
    this.error = false;
    this.locked = false;
    this.defaultOpen = false;
    this.initDone = false;
  }

  ngOnInit() {

    if (this.defaultOpen) {
      setTimeout(()=> {
        this.toggle();
      }, 500);
     
    }

  }

  toggle() {
    if (this.drawerToggle && this.drawerToggle.nativeElement) {
      this.drawerToggle.nativeElement.click();
    }
  } 

  ngOnChanges(changes) {
    this.hasStep = !! (this.step && this.step.length);
    
    // if (changes.locked) {

    //   if (this.defaultOpen && !this.initDone) {
    //     return;
    //   }      

    //   setTimeout(()=> {
    //     this.toggle();
    //   }, 200); 

        
      
    // }
  }

}
