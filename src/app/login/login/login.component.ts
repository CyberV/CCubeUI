import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() context:string;

  showLogin:boolean;
  loginOnly:boolean;
  loading: boolean;

  @ViewChildren('loginForm') loginForm : QueryList<LoginFormComponent>;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 

    this.showLogin = false;
    this.loginOnly = false;
    this.loading =false;
  }

  ionViewWillEnter() {
   
  }

  createUser() {
    if (this.loginForm.first) {
      this.loading = true;
      this.loginForm.first.createUser();
    }
    
  }

  ngOnInit() {

    console.log('url', this.activatedRoute.url, 'onject ', this.activatedRoute);
    this.showLogin = this.activatedRoute.snapshot.routeConfig.path === 'login';
  }

}
