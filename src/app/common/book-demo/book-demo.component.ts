import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/login/login.service';
import { CarService } from 'app/services/car.service';
import { AccordionComponent } from '../accordion/accordion.component';
import { scrollToBottom } from 'app/util/util';

@Component({
  selector: 'book-demo',
  templateUrl: './book-demo.component.html',
  styleUrls: ['./book-demo.component.scss'],
})
export class BookDemoComponent implements OnInit {

  @Input() compact: boolean;

  @ViewChildren('bookAccordion') bookAccordion : QueryList<AccordionComponent>;

  phone: any;
  name: any;
  location: any;
  booked:any;
  details:any;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private carService:CarService
  ) {
    this.compact = false;
    this.booked = false;
    this.details = {};

    this.phone = "";
    this.name = "";
    this.location = {

    };
  }

  open() {
    this.bookAccordion.first.toggle(true);


  }

  clearDemo() {
    localStorage.setItem('demoBooked', null);
    window.location.reload();
  }

  ngOnInit() {
    let booked = localStorage.getItem('demoBooked');

    if (booked) {
      booked = JSON.parse(booked);

      if (booked) {
        this.booked = true;
        this.details = booked;
      } else {
        this.booked = false;
      }

    } else {
      this.booked = false;
    }
  }

  bookDemo(location) {
    console.log('Booking Demo for ', location);

    if (!location) {
      return;
    }
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
        localStorage.setItem('demoBooked', JSON.stringify({
          car: this.carService.getCurrentCar(),
          date: new Date()
        }));
        window.location.reload();
      } else {
        alert(response.errorMsg || response.error.msg || response.error)
      }
    })

  }

}
