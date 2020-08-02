import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/login/login.service';
import { UserService } from 'app/services/user.service';
import { IUser } from 'app/services/IUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  currentUser: IUser;

  constructor(
    private srvcUser: UserService,
    private router:Router,
    private srvcLogin: LoginService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.srvcUser.isLoggedIn();

    if (this.isLoggedIn) {
      this.currentUser = this.srvcUser.getCurrentUser();
    }
    
    this.srvcUser.listner().subscribe( (evt:any) => {
      switch (evt.event) {
        case 'LOGGED_IN': {

          this.isLoggedIn = true;
          this.currentUser = evt.user;
          break;
        }
        case 'LOGGED_OUT': {
          this.isLoggedIn = false;
          this.currentUser = null;
          break;
        }
        default: {
          break;
        }
      }
    })
  }

  goTo(route) {
    this.router.navigate(route);
  }

  logoutUser() {
    this.srvcLogin.logout();
  }

}
