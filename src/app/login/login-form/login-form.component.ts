import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Platform } from '@ionic/angular';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
const { GoogleAuth } = Plugins;
import { ToastController } from '@ionic/angular';


import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

  yo: any;
  loading: boolean;

  @Input() context:string;

  public user: any;
  public isLoggedIn: boolean;
  public newUser: any;
  public customerMobile: string;
  public customerOtp: number;
  public otpMismatch: boolean;
  public isCarReady: boolean;
  public showCarSelector:boolean;
  public findingCar:boolean;
  public userExists:boolean;
  public forgotPassword:boolean;


  loadingDetails: boolean;
  otpSent:boolean;

  get isMobile() {
    return !this.platform.is('desktop');
  }

  @Input() page: string;   // home, login, signup

  get isTypingRegNo() {
    return this.newUser.car.regNo && this.newUser.car.regNo.length > 2;
  }

  get isPhoneValid() {
    return this.newUser.mobile && (this.newUser.mobile.length>=9);
  }

  get isRegNoValid() {
    let valid = false;
    let reg = this.newUser.car.regNo;

    if (!reg ) {
      return valid;
    } 
    if (reg.length < 8) {
      return valid;
    }

    if (isNaN(reg[0]) && isNaN(reg[1]) ) {    // HR
      if (!isNaN(reg[2]) && !isNaN(reg[3])) {    // 51
        if(isNaN(reg[4])) {
          if (!isNaN(reg[reg.length - 1]) && !isNaN(reg[reg.length - 2]) ) {
            valid = true;
          }
        }
      }
    }
    return valid;
  }



  constructor(
    private socialAuthService: AuthService,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    private srvcLogin: LoginService,
    private geolocation: Geolocation,
    private srvcUser: UserService,
    public toastController: ToastController,

    private router: Router) {

    this.page = 'home';
    this.otpMismatch = false;
    this.showCarSelector = false;
    this.isCarReady = false;
    this.loadingDetails = false;
    this.forgotPassword = false;
    this.loading = false;
    this.findingCar = false;
    this.otpSent = false;
    this.userExists = false;

    this.newUser = {
      car: {}
    };


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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.isCarReady = false;

    let savedMobile = sessionStorage.getItem('currentMobile');

    if (savedMobile && savedMobile != 'null') {
      this.newUser.mobile = savedMobile;

    }

    this.geolocation.getCurrentPosition().then((resp) => {


      console.log(resp.coords.latitude, resp.coords.longitude, resp.coords.accuracy);

      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);

    }).catch((error) => {
      this.presentToast('Error getting location');
    });



  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {

  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }

  goToPlans(carDetails) {


    sessionStorage.setItem('currentCar', JSON.stringify(carDetails));

    this.router.navigate(['plans'], { state: carDetails});
  }

  reset() {
    
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
      this.srvcLogin.sendOtp(this.newUser.mobile)
        .subscribe((res: any) => {
          console.log('Send OTP Response', res);
          if (res.success) {
            this.otpSent = true;
            this.loading = false;
            //this.page = "signup";
          }
        });
    }


  }

  onForgotPassword() {
    this.forgotPassword = true;
  }

  createUser() {
    if (!(this.newUser.mobile && this.newUser.mobile.length>=10 && this.newUser.name && this.newUser.name.length && this.newUser.password && this.newUser.password.length && this.newUser.email && this.newUser.email.length)) {
      return;
    }
    
    this.srvcLogin.createUser(this.newUser.mobile,this.newUser.name, this.newUser.password, this.newUser.email)
    .subscribe( (res:any) => {
      if (res.success) {

        this.presentToast('Account Created Successfully');

        this.srvcUser.setCurrentUser(res.data);

        //this.router.navigate(['/root/dashboard']);
        this.router.navigate(['/dashboard/select-car'] );
        this.page = 'car';
        

      } else {

        if (res.errorMsg == "User Exists for Mobile Number") {
          this.userExists = true;
        } else {
          alert('There was en error creating account. Please try again in some time.');
        }
        
      }

    });

  }


  async verifyOtp(otp) {
    if (!this.loading) {
      console.log('otp', otp);
      this.loading = true;
      let verified = await new Promise( (resolve,reject) => {
        this.srvcLogin.verifyOtp(this.newUser.mobile, this.customerOtp)
        .subscribe((res: any) => {
          console.log('Verify OTP REsponse', res);
          this.loading = false;
          if (res.success) {
            this.otpMismatch = false;
            resolve(true);
          } else {
            this.otpMismatch = true;
            resolve(false);
          }
        })
      });

      console.log('Verified', verified);

      if (verified) {
        sessionStorage.setItem('currentMobile', this.newUser.mobile);
        this.router.navigate(['/signup/details'])
      }
   
    }

  }


}
