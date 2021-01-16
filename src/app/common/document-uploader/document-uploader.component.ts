import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import S3 from 'aws-s3';
import { PhotoService } from 'app/services/photo.service';

@Component({
  selector: 'document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.scss'],
})
export class DocumentUploaderComponent implements OnInit {

  @Input() text: string;
  @Output() file = new EventEmitter();


  config = {
    bucketName: 'awsdocumentbucket',
    dirName: 'docs', /* optional */
    region: 'ap-south-1',
    accessKeyId: 'AKIAI7VHURXK5IEVYJZQ',
    secretAccessKey: 'JI3r5tRDfpbAgN+kxe90rEm0kFZHddmMIm6gQaXc'
  }


  constructor(
    private photoService:PhotoService
  ) {
    this.text = "Upload your Car Documents to your Vault for future use and Safe Keeping.";
  }

  ngOnInit() {

  }

  async sendFile() {
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
    console.log(await this.photoService.photos);

    //this.file.emit();
    const newFileName = 'whitell.png';
    //let file = fs.readFileSync('../../../../' + newFileName);

    const S3Client = new S3(this.config);
    /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

    /* This is optional */


    S3Client
      .uploadFile(this.photoService.photos[0].base64)
      .then(data => console.log('Data AWS', data))
      .catch(err => console.error('Error AWS', err))
  }

}
