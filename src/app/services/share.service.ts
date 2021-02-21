import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  appConfig:any;
  user: any;

  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private socialSharing: SocialSharing
  ) {
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

  shareReferral(refererCode) {

    let ddd:any = localStorage.getItem('commonData');
    if (ddd) {
      ddd = JSON.parse(ddd);

      this.appConfig = ddd.config;
    }

    let d = this.appConfig.filter((c) => c.name == 'APP_LINK')[0];
    var options = {
      message: `Use my Referral Code "${refererCode}" and signup on CCube to earn exciting rewards!`, // not supported on some apps (Facebook, Instagram)
      subject: 'the subject', // fi. for email
      files: ['', ''], // an array of filenames either locally or remotely
      url: d.value || 'www.ccubeco.com',
      chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      // appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
      iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };
    
    this.socialSharing.shareWithOptions(options);
  }

  shareImage(doc) {
    this.socialSharing.share('','', doc.image);
  }

  async shareRc(carRegNo) {
    return new Promise((resolve) => {
      this.socialSharing.shareViaEmail('PFA the Registration Certificate', 'RC for Car : ' + carRegNo, ['support@ccubeco.com']).then(() => {
        //this.presentToast()
        resolve(true);
     }).catch(() => {
       // Error!
       resolve(false);
     });
    })

  }

  shareWithOptions(options) {
    this.socialSharing.shareWithOptions(options);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  // getAllDocuments() {
  //   this.user = this.userService.getCurrentUser();

  //   if (this.user && this.user.phone) {
  //     let data = localStorage.getItem('docs-' + this.user.phone);
  //     if (data && data != "null") {
  //       data = JSON.parse(data);
  //       return data;
  //     }
  //   }
  //   return null;
  // }

  // getDocumentsForCar(carRegNo) {
  //   let docs = this.getAllDocuments();

  //   if (docs) {

  //     let carDocs = docs[carRegNo.toLowerCase()];

  //     if (carDocs && carDocs.length >= 4) {
  //       return carDocs;
  //     }
  //   }
  //   return JSON.parse(JSON.stringify(this.emptyDocs));
  // }

  // saveNewDocumentForCar(doc, carRegNo) {
  //   if (doc && carRegNo) {
  //     let carDocs = this.getDocumentsForCar(carRegNo);

  //     if (carDocs) {
  //       let found = carDocs.filter((cd) => cd.name == doc.name);

  //       if (found && found.length) {
  //         found = found[0];
  //         carDocs[carDocs.indexOf(found)] = doc;
  //         this.saveDocumentsForCar(carDocs, carRegNo);
  //       }
  //     }
  //   }
  // }

  // saveDocumentsForCar(docs, carRegNo) {
  //   let carNo = carRegNo.toLowerCase();
  //   let allDocs: any = this.getAllDocuments();

  //   if (allDocs) {

  //     allDocs[carNo] = docs;
  //     localStorage.setItem('docs-' + this.user.phone, JSON.stringify(allDocs));

  //   } else {
  //     let pld = {};
  //     pld[carNo] = docs;
  //     localStorage.setItem('docs-' + this.user.phone, JSON.stringify(pld));
  //   }

  //   // /alert('From Car Service' + JSON.stringify(this.getDocumentsForCar(carNo).map((d) => { return { localUrl: d.localUrl, name: d.name, hasImage: !!d.image }; })));
  // }


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
