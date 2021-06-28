import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { scrollElementToTop } from 'app/util/util';

@Component({
  selector: 'cc-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  @Input() title: string;
  @Input() step: string;
  @Input() error: boolean;

  @Input() compact: boolean;
  @Input() disabled: boolean;
  @Input() locked: boolean;
  @Input() defaultOpen: boolean;
  @Input() scrollable: boolean;
  @Input() label: string;
  @Input() empty: boolean;

  @Output() onToggle = new EventEmitter();

  @ViewChild('drawerToggle') drawerToggle: ElementRef;
  @ViewChild('drawerPannel') drawerPannel: MatExpansionPanel;

  lastTime:number;


  hasStep: boolean;
  initDone: boolean;

  public isOpen: boolean;

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
    this.isOpen = false;
    this.scrollable = false;
    this.empty = false;
  }

  ngOnInit() {

    if (this.defaultOpen) {
      setTimeout(() => {
        this.toggle();
      }, 500);

    }

  }

  ngAfterViewInit() {
    if (this.drawerPannel && !this.initDone) {
      this.drawerPannel.closed.subscribe(() => {
        this.onToggle.emit(false);
        this.isOpen = false;
      });
      this.drawerPannel.opened.subscribe(() => {
        this.onToggle.emit(true);
        this.isOpen = true;

        if (!this.compact) {
          setTimeout(() => {
            let inp: any = this.drawerToggle;
            scrollElementToTop(inp.nativeElement);
          }, 500);
        }
      });
      this.initDone = true;
    }
  }

  toggle(state = null) {

    if (!this.lastTime) {
      this.lastTime = +(new Date());
    } else {
      let now = +(new Date());

      if (now-this.lastTime > 1000) {

      } else {
        return;
      }
    }


    this.ngAfterViewInit();
    if (this.drawerToggle && this.drawerToggle.nativeElement) {
      if (state != null) {

        switch (state) {
          case true: {
            if (!this.isOpen) {
              this.drawerPannel.open();

            }
            break;
          }
          case false: {
            if (this.isOpen) {
              this.drawerPannel.close();
              //this.drawerToggle.nativeElement.click();

            }
            break;

          } default: ;
        }
        this.isOpen
      } else {
        this.drawerPannel.toggle();
        //this.drawerToggle.nativeElement.click();
      }
    }
  }

  onHandleClick(ev) {
    //this.onToggle.emit(this.isOpen);
    //console.log(ev);
  }

  ngOnChanges(changes) {
    this.hasStep = !!(this.step && this.step.length);

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
