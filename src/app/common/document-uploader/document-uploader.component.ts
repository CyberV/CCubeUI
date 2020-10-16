import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fileURLToPath } from 'url';

@Component({
  selector: 'document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.scss'],
})
export class DocumentUploaderComponent implements OnInit {

  @Input() text:string;
  @Output() file = new EventEmitter();

  constructor() {
    this.text = "Upload your Insurance Documents";
   }

  ngOnInit() {

  }

  sendFile() {
    this.file.emit();
  }

}
