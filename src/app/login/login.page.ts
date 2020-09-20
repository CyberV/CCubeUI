import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Platform } from '@ionic/angular';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'app/header.service';
const { GoogleAuth } = Plugins;


@Component({
  selector: 'page-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user: any;
  public isLoggedIn: boolean;
  public context:string;
  public ready:boolean;


  get isMobile() {
    return !this.platform.is('desktop');
  }


  constructor(
    private socialAuthService: AuthService, 
    public platform: Platform, 
    private headerService: HeaderService,
    private router:Router,
    private route: ActivatedRoute) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      GoogleAuth.addListener('userChange', (googleUser: any) => {
        console.log('userChange:', googleUser);
      });
    }
    else {
      this.socialAuthService.authState.subscribe((user) => {
        console.log('user', user);
        if (user != null) {
          this.user = user;
          this.isLoggedIn = true;
        }
        else {
          this.isLoggedIn = false;
        }
      });
    }

    this.route.params.subscribe((rdata) => {
      this.context = this.route.snapshot.routeConfig.path || 'signup';
    });

    this.ready = false;
  }

  ngOnInit() {
   
    //console.log('ads', this.activatedRoute.snapshot.url[0].path);
  }

  ionViewWillEnter () {

    let mobile = sessionStorage.getItem('currentMobile');

    if (!mobile && this.context=='details') {
      this.router.navigate(['/signup']);
      return;
    }
    
    switch(this.context) {
      case 'signup': {
        this.headerService.setText('Sign Up ');
        break;
      }
      case 'details': {
        this.headerService.setText('Personal Details');
        break;
      }
      case 'login': {
        this.headerService.setText('Sign In');
        break;
      }
      default: this.router.navigate(['/signup']);

    }

    this.ready = true;
  }

  async loginGoogle() {
    console.log('signing in with google');
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      let socialPlatformProvider: string;
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
        console.log('userInfo', userData);

      }).catch((error) => {
        console.log('error', error);
      });
    }
    else if (this.platform.is('android') || this.platform.is('ios')) {
      const googleUser = await GoogleAuth.signIn();
      console.log('signIn:', googleUser);
      this.user = googleUser;
    }

  }
  async refreshToken() {
    const response = await GoogleAuth.refresh();
    console.log('refresh:', response);
  }
  async loginFacebook() {
    console.log('signing in with facebook');
    let socialPlatformProvider: string;
    socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      console.log('userInfo', userData);

    }).catch((error) => {
      console.log('erro', error);
    });


  }
  async logout() {
    if (this.platform.is('desktop')) {
      this.socialAuthService.signOut();
    }
    else {
      await GoogleAuth.signOut();
    }

  }

}
