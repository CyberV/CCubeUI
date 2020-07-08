import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Platform } from '@ionic/angular';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { LoginService } from '../login.service';
const { GoogleAuth } = Plugins;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

  yo: any;
  loading: boolean;

  public user: any;
  public isLoggedIn: boolean;
  public newUser: any;
  public customerMobile: string;
  public customerOtp: number;
  public otpMismatch: boolean;

  get isMobile() {
    return !this.platform.is('desktop');
  }

  @Input() page: string;   // home, login, signup

  constructor(
    private socialAuthService: AuthService,
    public platform: Platform,
    private srvcLogin: LoginService) {

    this.page = 'home';
    this.otpMismatch = false;
    this.newUser = {};


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

    this.loading = false;
    this.yo = '';
  }

  ngOnInit() {
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

  beginAuth() {
    if (!this.loading) {
      this.loading = true;
      this.srvcLogin.sendOtp(this.customerMobile)
        .subscribe((res: any) => {
          console.log('Send OTP Response', res);
          if (res.success) {
            this.loading = false;
            this.page = "signup";
          }
        });
    }


  }


  verifyOtp(otp) {
    if (!this.loading) {
      console.log('otp', otp);
      this.loading = true;
      this.srvcLogin.verifyOtp(this.customerMobile, this.customerOtp)
        .subscribe((res: any) => {
          console.log('Verify OTP REsponse', res);
          this.loading = false;
          if (res.success) {
            alert('Mobile Number Verified');
            
            this.otpMismatch = false;
          } else {
            this.otpMismatch = true;
          }
        })
    }

  }


}
