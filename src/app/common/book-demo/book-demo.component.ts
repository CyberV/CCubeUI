import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/login/login.service';
import { CarService } from 'app/services/car.service';

@Component({
  selector: 'book-demo',
  templateUrl: './book-demo.component.html',
  styleUrls: ['./book-demo.component.scss'],
})
export class BookDemoComponent implements OnInit {

  @Input() compact: boolean;

  phone: any;
  name: any;
  location: any;
  booked:any;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private carService:CarService
  ) {
    this.compact = false;
    this.booked = false;

    this.phone = "";
    this.name = "";
    this.location = {

    };
  }

  ngOnInit() {
    let booked = localStorage.getItem('demoBooked');

    if (booked) {
      booked = JSON.parse(booked);
      this.booked = booked;

    }
  }

  bookDemo(location) {
    console.log('Booking Demo for ', location);

    let user = this.userService.getCurrentUser();

    let payload = {
      name: user.name,
      phone: user.phone,
      remarks: JSON.stringify({
        car: this.carService.getCurrentCar(),
        location: location
      })
    };

    this.loginService.addLead(payload).subscribe((response:any) => {
      if (response.success) {
        alert('Demo Request Submitted Successfully! Our team will soon be in touch.');
        sessionStorage.setItem('forDemo', 'null');
        localStorage.setItem('demoBooked', 'true');
        window.location.reload();
      } else {
        alert(response.errorMsg || response.error.msg || response.error)
      }
    })

  }

}
