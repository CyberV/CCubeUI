import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { UserService } from 'app/services/user.service';
import { HeaderService } from 'app/header.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'app/services/document.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private headerService: HeaderService,
    private socialSharing: SocialSharing,
    private documentService:DocumentService,
    private route: ActivatedRoute,
  ) {
    this.currentUser = null;
    this.ready = false;
  }

  currentUser: any;
  ready: boolean;

  context: string;
  profilePic:any;

  async ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }

  logOutUser() {
    this.loginService.logout();


  }

  share() {
    let d: any = localStorage.getItem('commonData');
    if (d) {
      d = JSON.parse(d);

      d = d.config.filter((c) => c.name == 'APP_LINK');
    }
    var options = {
      message: `Use my Referral Code "${this.currentUser.refererCode}" to earn exciting rewards!`, // not supported on some apps (Facebook, Instagram)
      subject: 'the subject', // fi. for email
      files: ['', ''], // an array of filenames either locally or remotely
      url: d.value || 'www.ccubeco.com',
      chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      // appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
      iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };


    this.socialSharing.shareWithOptions(options).then((res: any) => {
      //alert(JSON.stringify(res));
    })
  }

  async ionViewWillEnter() {
    this.context = 'profile';
    this.ready = false;
    this.route.params.subscribe(async (rdata) => {
      this.context = this.route.snapshot.routeConfig.path || 'dashboard';
      let refreshed = await this.loginService.refreshUser(this.currentUser.phone);
      if (refreshed) {
        this.currentUser = refreshed;
      }

      this.profilePic = await this.documentService.getProfilePicture();

      switch (this.context) {
        case 'profile': {
          this.headerService.setText('Your Profile');
          this.ready = true;
          break;
        }
        case 'refer': {
          this.headerService.setText('Refer & Earn');
          this.ready = true;
          break;
        } default: {
          this.ready = true;
        }
        case 'contact': {
          this.headerService.setText('Contact Us');
          this.ready = true;
          break;
        } 
      }
    });
  }

  async setProfilePic() {
    this.profilePic = await this.documentService.updateProfilePicture();
    //window.location.reload();
  }

}
