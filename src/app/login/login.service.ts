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

//var CryptoJS = require("crypto-js");

//import * as CryptoJS from 'crypto-js';

// import { crypto } from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
    
    private domain: string = 'api-ccube.herokuapp.com';
    private url: string = 'https://' + this.domain + '/api/';
    
    //private url: string = 'http://localhost:4000/api/';
    private carUrl :string = this.url + "car/details/";
    
    constructor(
      private http: HttpClient, 
      private srvcUser: UserService,
      private router:Router,
      private activatedRoute: ActivatedRoute
      ) { }


    sendOtp(phone:string, email:string=null) {
      let payload = {
        phone,
      };

      if (email) {
        payload['email']=email;
      }
      return this.http.post(this.url + 'otp/send/', payload).pipe(
        catchError(this.handleError)
      );
    }

    resendOtp(phone:string) {
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

    createUser(phone, name, password, email, city) {

      let payload = {
        phone: phone,
        name: name,
        password:  password,
        email,
        city: city || "fbd"
        };


        return this.http.post(this.url + 'user/create', payload).pipe (
          catchError(this.handleError)
        );

    }

    logout() {
      this.srvcUser.setCurrentUser(null);
      this.srvcUser.setUserToken(null);
      this.router.navigate(['/home']);
    }

    loginWithOtp(phone, otp) {
      let payload = {
        phone: phone,
        otp: this.resendOtp
        };


        return this.http.post(this.url + 'login/otp', payload).pipe (
          catchError(this.handleError)
        );
    }

    login(phone, password) {

      
      let payload = {
        phone: phone,
        password: password
        };


        return this.http.post(this.url + 'login', payload).pipe (
          catchError(this.handleError)
        );
    }

    addPayment(payment) {
      return this.http.post(this.url + 'user/addpayment', payment).pipe (
        catchError(this.handleError)
      );
    }

    getPayments(phone) {
      return this.http.post(this.url + 'user/getpayments', {phone}).pipe (
        catchError(this.handleError)
      );
    }
    
    handleError(error: any) {
        console.error(error);
        return throwError(error); 
        //return Observable.throw(error || 'Server error');
    }

    getCarDetails(regNo) {
      
      return this.http.post(this.carUrl + regNo, {"phone": this.srvcUser.getCurrentUser().phone}).pipe (
        catchError(this.handleError)
      );
    }
    
}