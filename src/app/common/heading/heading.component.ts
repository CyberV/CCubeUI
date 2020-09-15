import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
})
export class HeadingComponent implements OnInit {

  @Input() text:string;
  @Input() color:string;
  @Input() size:number;
  @Input() align:string;
  
  @Input() outline:boolean;
@Input() showClose: boolean;


  constructor(
    private modalController:ModalController
  ) {
    this.align='left';
    this.text='';
    this.color='black';
    this.size= 20;
    this.outline = false;
    this.showClose = false;
   }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

}
