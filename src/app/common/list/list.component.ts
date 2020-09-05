import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

declare var $;
@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input() limit: number;

  get computedHeight() {
    return this.isExpanded ?  'auto' : (this.childHeight * this.limit) + 'px' ;
  }

  get childHeight() {
    return ($(this.emt).children &&  $(this.emt).children.length ) ? $($(this.emt).children[0]).height: 21;
  }

  get remainingCount() {
    return $('.list-container', this.emt.nativeElement) ?  $('.list-container', this.emt.nativeElement)[0].children.length - 5 : 5;
  }

  isExpanded : boolean;

  constructor(private emt:ElementRef) {
    this.limit = 3;
    this.isExpanded = false;
   }

  ngOnInit() {

  }

}
