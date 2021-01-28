import { Directive, ElementRef, Input } from '@angular/core';

declare var $;

@Directive({
  selector: '[Rs]'
})
export class RsDirective  {

  @Input('rscolor') color:string;

  constructor(private el: ElementRef) {

 
    let color = this.color || '#ec6b1e';

    $(this.el.nativeElement).prepend("<span style='color: " + color + "; margin-right: 5px;' >&#8377;</span>");
   }


}
