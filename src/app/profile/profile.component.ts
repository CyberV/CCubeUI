import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {}

  logOutUser() {
    this.loginService.logout();
  }

}
