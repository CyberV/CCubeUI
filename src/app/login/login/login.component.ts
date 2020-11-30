import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() context:string;

  showLogin:boolean;
  loginOnly:boolean;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 

    this.showLogin = false;
    this.loginOnly = false;
  }

  ionViewWillEnter() {
   
  }

  ngOnInit() {

    console.log('url', this.activatedRoute.url, 'onject ', this.activatedRoute);
    this.showLogin = this.activatedRoute.snapshot.routeConfig.path === 'login';
  }

}
