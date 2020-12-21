import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../login.service';
import { UserService } from 'app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Initialize } from 'app/common/common.service';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.scss'],
})
export class SigninFormComponent implements OnInit {

  @Input() context:string;
  @Output() forgotPassword = new EventEmitter();

  user:any;
  loading:boolean;
  showError: boolean;
  errorMsg: string;

  mobileError:string;

  @ViewChildren('inpPass') inpPass : QueryList<HTMLElement>;
  @ViewChildren('ctaLogin') ctaLogin : QueryList<HTMLElement>;


  get isPhoneValid() {
    return this.user.mobile && (this.user.mobile.length>=9);
  }

  constructor(
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private srvcLogin:LoginService,
    private srvcUser: UserService,
    private toastController: ToastController
  ) {
    this.user = {
      mobile:'',
      password:''
    };
    this.loading = false;
    this.showError= false;
    this.errorMsg= "";
    this.mobileError = null;

   }

  ngOnInit() {}

  sendOTP() {

  }

  focusTo(emt) {
    if (emt == 'inpPass') {
      this.inpPass.first.focus();
    } else {
      this.ctaLogin.first.focus();
    }
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  onForgotPassword() {
    //this.srvcLogin.sendOtp()

    console.log('wtf');
    this.forgotPassword.emit();

      // this.mobileError = !this.user.mobile || this.user.mobile.length < 10 ? 'Please Enter a Valid Phone Number' : null;
    
      // if (!this.mobileError) {
        
      // }
    
  }

  

  tryLogin() {
    this.loading = true;
    this.showError = false;
      this.srvcLogin.login(this.user.mobile, this.user.password).subscribe( (res:any) => {
        this.loading = false;
        if (res.success) {
          this.srvcUser.setCurrentUser(res.data.user);
          this.srvcUser.setUserToken(res.data.token);

          console.log('USER City found',res.data.user.city );
          Initialize(res.data.user.city);
          this.presentToast(res.data.msg);
          //alert(res.data.msg);
          this.router.navigate(['/dashboard/service']);
          

        } else {
          this.showError = true;
          this.errorMsg = res.errorMsg;
        }
      });
  }

}
