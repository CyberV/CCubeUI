import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { Storage } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  emptyDocs: any;
  user: any;

  constructor(
    private userService: UserService,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private file: File,
    private storage: Storage
  ) {
    this.emptyDocs = [{
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
    }];
    this.user = userService.getCurrentUser();
  }

  notificationsEmitter = new Subject();

  // getAllNotifications() {
  //   return {
  //     new: this.getNewNotifications(),
  //     historical: this.getHistoricalNotifications(),
  //     read: this.getReadNotifications()
  //   }
  // }

  async getAllDocuments() {
    return new Promise(async (resolve) => {
      this.user = await this.userService.getCurrentUser();

      if (this.user && this.user.phone) {
        let data = await this.storage.get('docs-' + this.user.phone).then((data) => {
          if (data && data != "null") {
            data = JSON.parse(data);
            resolve(data);
          }
        });

      }
      resolve(null);
    });

  }

  async isNameUnique(name) {
    let docs:any= await this.getAllDocuments();
    let found = docs.filter((d) => d.name == name);

    return found.length == 0;
  }

  async updateProfilePicture() {
    return new Promise(async (resolve) => {
      const fileURI: string = await this.fileChooser.open();
      const filePathUrl: string = await this.filePath.resolveNativePath(fileURI);
      const fileName: string = filePathUrl.substring(filePathUrl.lastIndexOf('/') + 1);
      const fileEntry: FileEntry = await this.file.resolveLocalFilesystemUrl(fileURI) as FileEntry;
      const reader: FileReader = new FileReader();
  
      let extnsn: any = fileName.split('.');
      extnsn = '.' + extnsn[extnsn.length - 1];
  
      let imageData;
  
      let fileReadResult: string | ArrayBuffer;
      let mp3File: any;
  
      fileEntry.file((file: any): void => {
        mp3File = file;
        reader.readAsDataURL(mp3File);
      });
  
      reader.onloadend = async () => {
        fileReadResult = reader.result;
        imageData = fileReadResult as string;
  
        let profilePic: any = {};
  
        profilePic.image = imageData;
        profilePic.filePathUrl = filePathUrl;
        profilePic.localUrl = 'ProfilePicture' + extnsn;
  
        this.storage.set('profilePicture', profilePic);
  
        let appDir = await this.file.resolveDirectoryUrl(this.file.applicationDirectory + "www/assets/docs/");
        fileEntry.copyTo(appDir, profilePic.localUrl);

        resolve(profilePic.image);
  
      };
    });


  }

  getProfilePicture() {
    return new Promise((resolve) => {
      this.storage.get('profilePicture').then((data: any) => {
        resolve(data && data.image ? data.image :"assets/icons/user.png" );
      });
    });
  }

  async getDocumentsForCar(carRegNo) {
    let docs = await this.getAllDocuments();

    if (docs) {

      let carDocs = docs[carRegNo.toLowerCase()];

      if (carDocs && carDocs.length >= 4) {
        return carDocs;
      }
    }
    return JSON.parse(JSON.stringify(this.emptyDocs));
  }

  async saveNewDocumentForCar(doc, carRegNo) {

    if (doc && carRegNo) {
      let carDocs = await this.getDocumentsForCar(carRegNo);

      if (carDocs) {
        let found = carDocs.filter((cd) => cd.name == doc.name);

        if (found && found.length) {
          found = found[0];
          carDocs[carDocs.indexOf(found)] = doc;
          await this.saveDocumentsForCar(carDocs, carRegNo);
        }
      }
    }
  }

  async removeDocument(doc, carRegNo) {
    let docs = await this.getDocumentsForCar(carRegNo);

    if (docs) {
      docs.splice(docs.indexOf(docs.filter((d) => d.name == doc.name)[0]), 1);
      await this.saveDocumentsForCar(docs, carRegNo);
      //console.log('After removing doc ', doc.name, await this.getDocumentsForCar(carRegNo));
      return docs;
    }
    return false;
  }

  async saveDocumentsForCar(docs, carRegNo) {
    try {
      //alert('Before Car Service' + JSON.stringify(docs.map((d) => { return { localUrl: d.localUrl, name: d.name, hasImage: !!d.image }; })));

      let carNo = carRegNo.toLowerCase();
      let allDocs: any = await this.getAllDocuments();

      if (allDocs) {

        allDocs[carNo] = docs;
        this.storage.set('docs-' + this.user.phone, JSON.stringify(allDocs));

      } else {
        let pld = {};
        pld[carNo] = docs;
        this.storage.set('docs-' + this.user.phone, JSON.stringify(pld));
      }

      //alert('After Car Service' + JSON.stringify((await this.getDocumentsForCar(carNo)).map((d) => { return { localUrl: d.localUrl, name: d.name, hasImage: !!d.image }; })));
    }
    catch (e) {
      alert('Error in Doc Service ' + JSON.stringify(e));
    }
  }


  getMIMEtype(fileName) {
    let ext = fileName.split('.').reverse()[0].toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }


  // events() {
  //   if (this.notificationsEmitter.closed) {
  //     this.notificationsEmitter = new Subject();
  //   }
  //   return this.notificationsEmitter;
  // }

  // sendNotificationUpdate() {
  //   this.notificationsEmitter.next(this.getAllNotifications());
  // 

  // clear() {
  //   this.storage.set('newNotifications', JSON.stringify([]));
  //   this.storage.set('historicalNotifications', JSON.stringify([]));
  //   this.storage.set('readNotifications', JSON.stringify([]));
  //   this.sendNotificationUpdate();
  // }


}
