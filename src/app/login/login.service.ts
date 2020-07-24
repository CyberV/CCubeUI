import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { map, catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';

// let crypto = require('crypto-js');

// let HASH = crypto.MD5;

//import {md5} from 'crypto-js/md5';

import { MD5 } from 'crypto-js';
//var CryptoJS = require("crypto-js");

//import * as CryptoJS from 'crypto-js';

// import { crypto } from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
    
    private url: string = 'https://ccubetest.azurewebsites.net/api/';
    private carUrl :string = 'https://autom8.herokuapp.com/carDetails/';
    
    constructor(private http: HttpClient) { }

    sendOtp(mobile:string, email:string=null) {
      let payload = {
        mobile,
      };

      if (email) {
        payload['email']=email;
      }
      return this.http.get(this.url + 'otp/send/' + mobile).pipe(
        catchError(this.handleError)
      );
    }

    resendOtp(mobile:string) {
      let payload = {
        mobile
      };
      return this.http.get(this.url + 'otp/resend/' + mobile).pipe(
      catchError(this.handleError));
    }

    verifyOtp(mobile, otp) {
      let payload = {
        mobile,
        otp
      };
      return this.http.get(this.url + 'otp/verify/' + mobile + "/" + otp).pipe(
      catchError(this.handleError));
    }

    createUser(mobile, fname, lname, password, email) {

      let payload = {
        mobile,
        name: fname + ' ' + lname,
        password:  MD5(password).toString(),
        email,
        loginType: 'MOBILE',
        role: 'PATIENT',
        status:'NONE' // s0 or empty // recieved from API 1 // to decide if user creation is needed for existing system or not
        };

        console.log(payload);

        return this.http.post(this.url + 'signUp', payload).pipe (
          catchError(this.handleError)
        );

    }
    
    handleError(error: any) {
        console.error(error);
        return throwError(error); 
        //return Observable.throw(error || 'Server error');
    }

    getCarDetails(regNo) {
      return this.http.get(this.carUrl + regNo).pipe (
        catchError(this.handleError)
      );
    }
    
}