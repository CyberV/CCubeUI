import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { map, catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';

// let crypto = require('crypto-js');

// let HASH = crypto.MD5;

//import {md5} from 'crypto-js/md5';

import { MD5 } from 'crypto-js';
import { UserService } from 'app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NotificationService } from 'app/services/notification.service';

//var CryptoJS = require("crypto-js");

//import * as CryptoJS from 'crypto-js';

// import { crypto } from 'crypto-js';

declare var _that;
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private domain: string = 'api-ccube.herokuapp.com';
  private  url: string = 'https://' + this.domain + '/api/';

  //private url: string = 'http://localhost:4000/api/';
  private carUrl: string = this.url + "car/details/";

  get currentUser() {
    return this.srvcUser.getCurrentUser();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  

  constructor(
    private http: HttpClient,
    private srvcUser: UserService,
    private notificationService: NotificationService,
    private toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    //_that = this;
  }


  sendOtp(phone: string, email: string = null) {
    let payload = {
      phone,
    };

    if (email) {
      payload['email'] = email;
    }
    return this.http.post(this.url + 'otp/send/', payload).pipe(
      catchError(this.handleError)
    );
  }

  resendOtp(phone: string) {
    let payload = {
      phone
    };
    return this.http.post(this.url + 'otp/resend/', payload).pipe(
      catchError(this.handleError));
  }

  verifyOtp(phone, otp) {
    let payload = {
      phone,
      otp
    };
    return this.http.post(this.url + 'otp/verify/', payload).pipe(
      catchError(this.handleError));
  }

  tryCoupon(amount, couponCode) {
    
    let payload = {
      amount,
      phone: this.currentUser.phone,
      couponCode
    };
    return this.http.post(this.url + 'subscription/trycoupon', payload).pipe(
      catchError(this.handleError));
  }

  getCouponsForUser() {
    return this.http.post(this.url + 'subscription/getcouponsforuser', { phone: this.currentUser.phone }).pipe(
      catchError(this.handleError));
  }

  createUser(phone, name, password, email, city, refCode = null) {

    let payload = {
      phone: phone,
      name: name,
      password: password,
      email,
      referedBy: refCode,
      city: city || "Faridabad"
    };


    return this.http.post(this.url + 'user/create', payload).pipe(
      catchError(this.handleError)
    );

  }


  async refreshUser(phone) {
    return new Promise(async (resolve) => {
      this.http.post(this.url + 'user/find/' + phone,{}).pipe(
        catchError(this.handleError)
      ).subscribe((res:any) => {
        if (res.success) {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          resolve(res.data);
        } else {
          resolve (false);
        }
      });
    })

  }

  logout() {
    this.srvcUser.setCurrentUser(null);
    this.srvcUser.setUserToken(null);

    sessionStorage.clear();

    this.router.navigate(['/home']);
  }

  loginWithOtp(phone, otp) {
    let payload = {
      phone: phone,
      otp: otp
    };

    return this.http.post(this.url + 'login/otp', payload).pipe(
      catchError(this.handleError)
    );
  }


  rescheduleService(phone, carRegNo, fromDate, toDate, addonName = '') {
    let payload = {
      phone,
      carRegNo,
      fromDate : new Date(fromDate).toDateString(),
      toDate: new Date(toDate).toDateString(),
      addonName
    };

    return this.http.post(this.url + 'subscription/rescheduleService', payload).pipe(
      catchError(this.handleError)
    );
  }
  login(phone, password) {


    let payload = {
      phone: phone,
      password: password
    };


    return this.http.post(this.url + 'login', payload).pipe(
      catchError(this.handleError)
    );
  }

  addPayment(payment) {
    return this.http.post(this.url + 'subscription/addpayment', payment).pipe(
      catchError(this.handleError)
    );
  }

  addAddon(addon) {
    return this.http.post(this.url + 'subscription/addaddon', addon).pipe(
      catchError(this.handleError)
    );
  }

  scheduleAddon(payload) {
    return this.http.post(this.url + 'subscription/scheduleAddon', payload).pipe(
      catchError(this.handleError)
    );
  }

  

  addAdhoc(adhoc) {
    return this.http.post(this.url + 'subscription/addadhoc', adhoc).pipe(
      catchError(this.handleError)
    );
  }

  renewPayment(payment) {
    return this.http.post(this.url + 'subscription/renewpayment', payment).pipe(
      catchError(this.handleError)
    );

  }

  updateToken(token) {
    let phone = this.srvcUser.getCurrentUser().phone;
    return this.http.post(this.url + 'user/updateToken', { phone, token }).pipe(
      catchError(this.handleError)
    );
  }

  getPayments(phone) {
    return this.http.post(this.url + 'subscription/getsubscriptions', { phone }).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
    //return Observable.throw(error || 'Server error');
  }

  addLead(data) {
    return this.http.post(this.url + 'lead/create', data).pipe (
      catchError(this.handleError)
    );
  }

  getCommonData() {
    return this.http.get(this.url + 'plan/getCommonData').pipe (
      catchError(this.handleError)
    );
  }

  getCarDetails(regNo) {

    return this.http.post(this.carUrl + regNo, { "phone": this.srvcUser.getCurrentUser().phone }).pipe(
      catchError(this.handleError)
    );
  }

}