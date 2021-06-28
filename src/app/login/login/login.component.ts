import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() context: string;

  showLogin: boolean;
  loginOnly: boolean;
  loading: boolean;

  @ViewChildren('loginForm') loginForm: QueryList<LoginFormComponent>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    this.showLogin = false;
    this.loginOnly = false;
    this.loading = false;
  }

  ionViewWillEnter() {

  }

  ngOnChanges(changes) {
    if (changes.context && this.context) {
      if (this.context == 'details2') {
        let u = JSON.parse(sessionStorage.getItem('partialUser'));

        if (u && u!="null") {
          setTimeout(()=> {
            debugger;
            this.loginForm.first.newUser = u;
          }, 200);
        }


      }
    }
  }

  showNextDetails() {
    let x = this.loginForm.first.validateData({ mobile: ' ' }, true);

    debugger;

    if (x) {
      let u =  this.loginForm.first.newUser;
      sessionStorage.setItem('partialUser', JSON.stringify(u) );
      this.router.navigate(['/signup/details2']);
      //this.context = 'details2';
    }
  }


  createUser() {
    if (this.loginForm.first) {
      this.loading = true;
      this.loading = this.loginForm.first.createUser();
    }

  }

  ngOnInit() {

    console.log('url', this.activatedRoute.url, 'onject ', this.activatedRoute);
    this.showLogin = this.activatedRoute.snapshot.routeConfig.path === 'login';
  }

}
