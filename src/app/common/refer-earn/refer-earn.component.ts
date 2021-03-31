import { Component, OnInit, Input } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { UserService } from 'app/services/user.service';
import { BPClient } from 'blocking-proxy';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'refer-earn',
  templateUrl: './refer-earn.component.html',
  styleUrls: ['./refer-earn.component.scss'],
})
export class ReferEarnComponent implements OnInit {

  @Input() slim:boolean;

  @Input() noPadding:boolean;

  currentUser:any;
  config: any;
  milestoneLength: number;
  milestoneMax: number;
  currentMilestone: number;
  currentProgress:number;
  appConfig:any;

  pendingCount: number;
  detailsOpen:boolean;

  arrays:any;

  constructor(private socialSharing: SocialSharing,
    private modalController: ModalController,
    private router: Router,
    private userService:UserService) {
      this.milestoneLength = 3;
      this.milestoneMax = 10;
      this.arrays = {};
      this.detailsOpen = true;
      this.slim = false;
      this.appConfig = {};
      this.noPadding = false;
    }


  async tryProfile() {
    
    if (this.slim) {
      this.router.navigate(['/refer']);
    // const modal = await this.modalController.create({
    //   component: ReferEarnComponent,
    //   cssClass: 'refer-modal',
    //   componentProps: {}
    // });
    // await modal.present();
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }




  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    let d:any = localStorage.getItem('commonData');
    if (d) {
      d = JSON.parse(d);

      this.appConfig = d.config;
      this.config = d.config.filter((c) => c.name=='REFER_CONFIG')[0].value;

      this.milestoneLength = +this.config.signup.unitCount;
      this.milestoneMax = +(this.config.signup.megaCount / this.config.signup.unitCount);
    } else {
      this.config = [];
    }

    this.currentMilestone = Math.floor(this.currentUser.referCount / this.milestoneLength);
    this.currentProgress = Math.floor(this.currentUser.referCount % this.milestoneLength);

    this.pendingCount = this.milestoneLength - this.currentProgress;

    this.arrays.pending = [];
    this.arrays.current = [];
    for (let i=0;i<this.pendingCount;i++) {
      this.arrays.pending.push('');
    } 
    for (let i=0;i<this.currentProgress;i++) {
      this.arrays.current.push('');
    } 

  }

  share() {

    let d = this.appConfig.filter((c) => c.name == 'APP_LINK')[0];
    var options = {
      message: `Use my Referral Code "${this.currentUser.refererCode}" and signup on CCube to earn exciting rewards!`, // not supported on some apps (Facebook, Instagram)
      subject: 'the subject', // fi. for email
      files: ['', ''], // an array of filenames either locally or remotely
      url: d.value || 'www.ccubeco.com',
      chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      // appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
      iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };
    
    this.socialSharing.shareWithOptions(options).then((res:any) => {
      //alert(JSON.stringify(res));
    })
  }


}
