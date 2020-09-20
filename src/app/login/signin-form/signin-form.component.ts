import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { UserService } from 'app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.scss'],
})
export class SigninFormComponent implements OnInit {

  @Input() context:string;

  user:any;
  loading:boolean;
  showError: boolean;
  errorMsg: string;


  get isPhoneValid() {
    return this.user.mobile && (this.user.mobile.length>=9);
  }

  constructor(
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private srvcLogin:LoginService,
    private srvcUser: UserService
  ) {
    this.user = {
      mobile:'',
      password:''
    };
    this.loading = false;
    this.showError= false;
    this.errorMsg= "";

   }

  ngOnInit() {}

  sendOTP() {

  }

  

  tryLogin() {
    this.loading = true;
    this.showError = false;
      this.srvcLogin.login(this.user.mobile, this.user.password).subscribe( (res:any) => {
        this.loading = false;
        if (res.success) {
          this.srvcUser.setCurrentUser(res.data.user);
          this.srvcUser.setUserToken(res.data.token);
          alert(res.data.msg);
          this.router.navigate(['/dashboard/select-car']);
          

        } else {
          this.showError = true;
          this.errorMsg = res.errorMsg;
        }
      });
  }

}
