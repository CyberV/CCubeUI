import { Component, OnInit } from '@angular/core';

import { FileChooser } from '@ionic-native/file-chooser/ngx';

@Component({
  selector: 'document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {

  options = {
    centeredSlides: false,
    slidesPerView: 2.3,
    spaceBetween: 12,
  };

  documents:any;

  constructor(
    private fileChooser: FileChooser
  ) {
    this.documents = [{
      name: 'Driving License'
    },
    {
      name: 'Registration Certificate'
    },
    {
      name: 'Insurance Policy'
    },
    {
      name: 'Pollution Certificate'
    }]
   }

  ngOnInit() {}

  openFile(doc) {
    this.fileChooser.open().then((data:any) => {
      alert(JSON.stringify(data));
    })
    
  }

}
