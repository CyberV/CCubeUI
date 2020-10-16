import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { UserService } from 'app/services/user.service';
import { HeaderService } from 'app/header.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private userService:UserService,
    private headerService:HeaderService
  ) {
    this.currentUser = null;
   }

  currentUser:any;

  context:string;

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.headerService.setText('Your Profile');
  }

  logOutUser() {
    this.loginService.logout();

    
  }

  ionViewWillEnter() {
    this.context = 'profile';
  }

}
