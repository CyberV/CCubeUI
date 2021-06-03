import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[note]'
})
export class NoteDirective {

  constructor(el:ElementRef) {
    el.nativeElement.style.color = "gray";
    el.nativeElement.style.fontStyle = "italic";
    el.nativeElement.style.fontSize = "90%";
  }

}

