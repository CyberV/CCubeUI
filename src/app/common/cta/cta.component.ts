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

  @Input() subtext: string;
  @Input() secondaryCta:string;

  @Output() action = new EventEmitter();

  constructor() {
    this.text = "CTA";
    this.disabled = false;
    this.loading = false;
    this.outline = false;
    this.size = 18;
  }

  onCtaClick() {
    this.action.emit();
  }

  ngOnInit() {}

}
