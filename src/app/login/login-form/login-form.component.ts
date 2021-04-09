import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Platform, ModalController } from '@ionic/angular';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';

const { GoogleAuth } = Plugins;
import { ToastController } from '@ionic/angular';
import { Initialize } from 'app/common/common.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CarService } from 'app/services/car.service';
import { VerifyOtpComponent } from 'app/common/verify-otp/verify-otp.component';
import { TermsComponent } from 'app/common/terms/terms.component';

declare var SMSReceive: any;
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

  yo: any;
  loading: boolean;

  @Input() context: string;
  @Input() loginOnly:boolean;

  public user: any;
  public isLoggedIn: boolean;
  public newUser: any;
  public customerMobile: string;
  public customerOtp: number;
  public otpMismatch: boolean;
  public isCarReady: boolean;
  public showCarSelector: boolean;
  public findingCar: boolean;
  public userExists: boolean;
  public forgotPassword: boolean;
  existingUser:boolean;
  

  @ViewChildren('inpRef') inpRef: QueryList<HTMLElement>;
  @ViewChildren('inpEmail') inpEmail: QueryList<HTMLElement>;
  @ViewChildren('inpCity') inpCity: QueryList<HTMLElement>;
  @ViewChildren('inpPass') inpPass: QueryList<HTMLElement>;
  @ViewChildren('inpConfirmPass') inpConfirmPass: QueryList<HTMLElement>;
  @ViewChildren('ctaSignup') ctaSignup: QueryList<HTMLElement>;
  @ViewChildren('ctaOtp') ctaOtp: QueryList<HTMLElement>;
  @ViewChildren('verifyOtpComp') verifyOtpComp : QueryList<VerifyOtpComponent>;


  errors: any;


  loadingDetails: boolean;
  otpSent: boolean;


  get isMobile() {
    return !this.platform.is('desktop');
  }

  @Input() page: string;   // home, login, signup

  get isTypingRegNo() {
    return this.newUser.car.regNo && this.newUser.car.regNo.length > 2;
  }

  get isPhoneValid() {
    return this.newUser.mobile && (this.newUser.mobile.length > 9);
  }

  get isRegNoValid() {
    let valid = false;
    let reg = this.newUser.car.regNo;

    if (!reg) {
      return valid;
    }
    if (reg.length < 8) {
      return valid;
    }

    if (isNaN(reg[0]) && isNaN(reg[1])) {    // HR
      if (!isNaN(reg[2]) && !isNaN(reg[3])) {    // 51
        if (isNaN(reg[4])) {
          if (!isNaN(reg[reg.length - 1]) && !isNaN(reg[reg.length - 2])) {
            valid = true;
          }
        }
      }
    }
    return valid;
  }
  
  allInputs;
  userNotFound:boolean;

  upgradeSelected:boolean;

  constructor(
    private socialAuthService: AuthService,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    private srvcLogin: LoginService,
    private geolocation: Geolocation,
    private srvcUser: UserService,
    private carService: CarService,
    private modalController:ModalController,
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
    this.allInputs = {};
    this.userNotFound = false;
    this.existingUser = false;
    this.upgradeSelected = false;
    this.loginOnly = false;

    this.newUser = {
      car: {}
    };

    this.errors = {};


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
    //this.otpSent = true;

    let savedMobile = localStorage.getItem('userMobile');

    if (savedMobile && savedMobile != 'null') {
      this.newUser.mobile = savedMobile;

    }

    // this.geolocation.getCurrentPosition().then((resp) => {


    //   console.log(resp.coords.latitude, resp.coords.longitude, resp.coords.accuracy);

    //   this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);

    // }).catch((error) => {
    //   this.presentToast('Error getting location');
    // });



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


    this.carService.changeCar(carDetails);

    this.router.navigate(['plans'], { state: carDetails });
  }

  reset() {

  }

  focusTo(emt) {

    this.allInputs = {
      inpRef: this.inpRef.first,
      inpEmail: this.inpEmail.first,
      inpCity: this.inpCity.first,
      inpPass: this.inpPass.first,
      inpConfirmPass: this.inpConfirmPass.first,
      ctaSignup: this.ctaSignup.first,
      ctaOtp: this.ctaOtp.first
    }

    let e = this.allInputs[emt];

    if (e) {
      e.focus();
    }
  }

  handleOtp(otp) {
    this.customerOtp = otp;

    if (otp.toString().length == 4) {
      this.verifyOtp(this.customerOtp);
    }

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
      localStorage.setItem('userMobile', this.newUser.mobile);
      this.srvcLogin.sendOtp(this.newUser.mobile)
        .subscribe((res: any) => {
          console.log('Send OTP Response', res);
          if (res.success) {
            this.existingUser = res.data.existingUser;
            this.otpSent = true;
            this.start();
            this.loading = false;

            //this.page = "signup";
          }
        });
    }


  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let xx =  re.test(String(email).toLowerCase());

    if(xx) {
      this.errors.email = null;
    }

    return xx;
}

  onForgotPassword() {
    this.forgotPassword = true;
  }

  validateData(data) {
    let valid: any = {
      phone: false,
      email: false,
      city: false,
      name: false,
      password: false
    };

    this.errors = {};

    if (data.mobile && this.newUser.mobile.length >= 10) {
      valid.phone = true;
    } else {
      this.errors['phone'] = 'Please enter a valid Phone Number.'
    }


    
    if (this.newUser.name && this.newUser.name.length) {
      valid.name = true;
    } else {
      this.errors['name'] = 'Please enter a valid User Name.'
    }

    if (this.newUser.city && this.newUser.city.length) {
      valid.city = true;
    } else {
      this.errors['city'] = 'Please select a City.';
    }

    if (this.newUser.password && this.newUser.password.length && this.newUser.password.length >= 4 && this.newUser.password == this.newUser.confirmPassword) {
      valid.password = true;
    } else {


      this.errors['password'] = '';

      if (this.newUser.password && this.newUser.password.length < 4) {
        this.errors['password'] += " Atleast 4 characters required."
      } else  if (this.newUser.password != this.newUser.confirmPassword) {
        this.errors['password'] += " Passwords don't match."
      } else {
        this.errors['password'] = 'Please enter a valid Password.';
      }
    }

    if (this.newUser.email && this.newUser.email.length && this.validateEmail(this.newUser.email)) {
      valid.email = true;
    } else {
      this.errors['email'] = '';
      this.errors['email'] = 'Please enter a valid Email.'
    }

    if (this.upgradeSelected) {
      valid.terms = true;
    } else {
      valid.terms = false;
      this.errors['terms'] = '';
      this.errors['terms'] = 'Please accept:'
    }


    return !((valid.terms && valid.name && valid.phone && valid.password && valid.email && valid.city) ? false : true);

  }

  async showTerms() {
    let modal = await this.modalController.create({
      component: TermsComponent,
      cssClass: 'terms-modal',
      swipeToClose: true,
      showBackdrop: true,
      backdropDismiss: true,
      componentProps: {
        showClose: true
      }
    });

    await modal.present();
  }

  createUser() {
    if (!this.validateData(this.newUser)) {
      return false;
    } else {
      this.errors = {};
    }

    this.srvcLogin.createUser(this.newUser.mobile, this.newUser.name, this.newUser.password, this.newUser.email, this.newUser.city, this.newUser.referedBy)
      .subscribe((res: any) => {
        if (res.success) {

          this.presentToast('Account Created Successfully');

          this.srvcUser.setCurrentUser(res.data);

          console.log('USER City found',res.data.city );
          Initialize(res.data.city);

          //this.router.navigate(['/root/dashboard']);
          this.router.navigate(['/dashboard/select-car']);
          this.page = 'car';


        } else {
          // Error from Server
          if (res.errorMsg == "User Exists for Mobile Number") {
            this.userExists = true;
          } else if (res.error && res.error.errmsg.indexOf('duplicate key error') > -1 && res.error.errmsg.indexOf('email') > -1) {
            if (!this.errors) {
              this.errors = {};
            }

            this.errors['email'] = 'An account exists with this email Id. Please use another one.';

          } else {
            alert('There was en error creating account. Please try again in some time.');
          }


        }



      });

  }

  start() {
    try {

    
    if (SMSReceive)
    SMSReceive.startWatch(
      () => {
        document.addEventListener('onSMSArrive', (e: any) => {
          var IncomingSMS = e.data;
          this.processSMS(IncomingSMS);
        });
      },
      () => { console.log('watch start failed') }
    );
    } catch(e) {
      console.log('Error in SMS', e);
    }
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  processSMS(data) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;


    if (message && message.indexOf('CCube') != -1) {
      let split = message.split('.')[0].split(' ');
      this.customerOtp = split[split.length - 1];
      this.verifyOtpComp.first.fillOtp(this.customerOtp);
      //this.OTP = data.body.slice(0, 6);
      //this.OTPmessage = 'OTP received. Proceed to register'
      this.stop();
    }
  }


  async verifyOtp(otp) {

    if (this.loginOnly && this.userNotFound) {
      localStorage.setItem('userMobile', this.newUser.mobile);
      this.router.navigate(['/signup/details']);
      return;
    }
    if (!this.loading) {
      console.log('otp', otp);
      if (this.loginOnly) {
        this.existingUser = true;
      }
      this.loading = true;
      let verified:any = await new Promise((resolve, reject) => {
        if (this.existingUser) {
          this.srvcLogin.loginWithOtp(this.newUser.mobile, this.customerOtp)
          .subscribe((res: any) => {
            console.log('Verify OTP REsponse', res);
            this.loading = false;
            if (res.success) {
              this.otpMismatch = false;
              this.userNotFound = false;
              resolve(res);
            } else {
              this.otpMismatch = res.error == "Invalid OTP";
              this.userNotFound = res.error == "Phone Verified. User Not Found";
              resolve(res);
            }
          })
        } else {
          this.srvcLogin.verifyOtp(this.newUser.mobile, this.customerOtp)
          .subscribe((res: any) => {
            console.log('Verify OTP REsponse', res);
            this.loading = false;
            if (res.success) {
              this.otpMismatch = false;
              this.userNotFound = false;
              resolve(res);
            } else {
              this.otpMismatch = true;
              resolve(res);
            }
          })
        }
        
      });

      console.log('Verified', verified);

      if (verified.success) {

        if (this.existingUser) {
          this.srvcUser.setCurrentUser(verified.data.user);
          this.srvcUser.setUserToken(verified.data.token);

          this.presentToast(verified.data.msg);
          //alert(res.data.msg);
          this.router.navigate(['/dashboard/service']);
        } else {


        localStorage.setItem('userMobile', this.newUser.mobile);
        this.router.navigate(['/signup/details']);
        }
      }

    }

  }


}
