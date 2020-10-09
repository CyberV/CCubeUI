import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
})
export class CtaComponent implements OnInit {

  @Input() text: string;
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() outline: boolean;
  @Input() size: number;
  @Input() small:boolean;
  @Input() icon:string;

  @Input() subtext: string;
  @Input() secondaryCta:string;

  @Input() sticky: boolean;

  @Output() action = new EventEmitter();

  get hasIcon() {
    return this.icon.length;
  }

  constructor() {
    this.text = "CTA";
    this.disabled = false;
    this.loading = false;
    this.outline = false;
    this.size = 18;
    this.sticky = false;

    this.small = false;
    this.icon="";
  }

  onCtaClick() {
    this.action.emit();
  }

  ngOnInit() {
  }

}
