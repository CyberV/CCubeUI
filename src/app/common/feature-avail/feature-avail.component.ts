import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'feature-avail',
    template: ` <span> 
    <svg *ngIf="available" class="bi bi-check" [attr.width]="size + 'em'" [attr.height]="size + 'em'" viewBox="0 0 16 16" fill="green" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
  </svg> 
       <svg *ngIf="!available" class="bi bi-x" [attr.width]="size + 'em'" [attr.height]="size + 'em'" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
    <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
  </svg>  </span>`
  })
  export class FeatureAvail implements OnInit {
  
    @Input() available:boolean;
    @Input() size:number;
    constructor() {
  
      this.available = false;
      this.size = 2;
    }
  
    ngOnInit() {
  
    }
  }
  