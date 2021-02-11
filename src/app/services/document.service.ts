import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  emptyDocs: any;
  user: any;

  constructor(
    private userService: UserService
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

  getAllDocuments() {
    this.user = this.userService.getCurrentUser();

    if (this.user && this.user.phone) {
      let data = localStorage.getItem('docs-' + this.user.phone);
      if (data && data != "null") {
        data = JSON.parse(data);
        return data;
      }
    }
    return null;
  }

  getDocumentsForCar(carRegNo) {
    let docs = this.getAllDocuments();

    if (docs) {

      let carDocs = docs[carRegNo.toLowerCase()];

      if (carDocs && carDocs.length == 4) {
        return carDocs;
      }
    }
    return JSON.parse(JSON.stringify(this.emptyDocs));
  }

  saveNewDocumentForCar(doc, carRegNo) {
    if (doc && carRegNo) {
      let carDocs = this.getDocumentsForCar(carRegNo);

      if (carDocs) {
        let found = carDocs.filter((cd) => cd.name == doc.name);

        if (found && found.length) {
          found = found[0];
          carDocs[carDocs.indexOf(found)] = doc;
          this.saveDocumentsForCar(carDocs, carRegNo);
        }
      }
    }
  }

  saveDocumentsForCar(docs, carRegNo) {
    let carNo = carRegNo.toLowerCase();
    let allDocs: any = this.getAllDocuments();

    if (allDocs) {

      allDocs[carNo] = docs;
      localStorage.setItem('docs-' + this.user.phone, JSON.stringify(allDocs));

    } else {
      let pld = {};
      pld[carNo] = docs;
      localStorage.setItem('docs-' + this.user.phone, JSON.stringify(pld));
    }

    alert(JSON.stringify(this.getDocumentsForCar(carNo).map((d) => { return { localUrl: d.localUrl, name: d.name, hasImage: !!d.image }; })));
  }


  getMIMEtype(fileName){
    let ext=fileName.split('.').reverse()[0].toLowerCase();
    let MIMETypes={
      'txt' :'text/plain',
      'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc' : 'application/msword',
      'pdf' : 'application/pdf',
      'jpg' : 'image/jpeg',
      'bmp' : 'image/bmp',
      'png' : 'image/png',
      'xls' : 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf' : 'application/rtf',
      'ppt' : 'application/vnd.ms-powerpoint',
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
  //   localStorage.setItem('newNotifications', JSON.stringify([]));
  //   localStorage.setItem('historicalNotifications', JSON.stringify([]));
  //   localStorage.setItem('readNotifications', JSON.stringify([]));
  //   this.sendNotificationUpdate();
  // }


}
