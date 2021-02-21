import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'image-toolbar',
  templateUrl: './image-toolbar.component.html',
  styleUrls: ['./image-toolbar.component.scss'],
})
export class ImageToolbarComponent implements OnInit {

  @Input() showDelete: boolean;

  constructor(
    private modalController: ModalController
  ) {
    this.showDelete = false;
   }

   onAction(actionName) {
     this.modalController.dismiss({
       action: actionName,
     })
   }

  ngOnInit() {

  }

}
