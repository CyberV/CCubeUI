import { Directive, ElementRef } from '@angular/core';

declare var $;

@Directive({
  selector: '[Rs]'
})
export class RsDirective {

  constructor(private el: ElementRef) {

    $(this.el.nativeElement).prepend("<span style='color: #ec6b1e; margin-right: 5px;' >&#8377;</span>");
   }

}
