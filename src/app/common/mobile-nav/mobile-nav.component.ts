import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(
    private userService: UserService
  ) {
    this.isLoggedIn = false;
   }

  ngOnInit() {

    this.isLoggedIn = this.userService.isLoggedIn();

    this.userService.listner().subscribe ( (evt:any) => {
      this.isLoggedIn = evt.event === 'LOGGED_IN';
    });
  }

}
