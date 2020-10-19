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
    this.text = "Upload your Car Documents to your Vault for future use and Safe Keeping.";
   }

  ngOnInit() {

  }

  sendFile() {
    this.file.emit();
  }

}
