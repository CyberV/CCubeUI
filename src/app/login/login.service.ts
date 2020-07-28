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
    
    //private url: string = 'https://ccubetest.azurewebsites.net/api/';
    private url: string = 'http://localhost:4000/api/';
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

    createUser(mobile, name, password, email) {

      let payload = {
        phone: mobile,
        name: name,
        password:  MD5(password).toString(),
        email,
        city: "faridabad"
        };

        console.log(payload);

        return this.http.post(this.url + 'user/create', payload).pipe (
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