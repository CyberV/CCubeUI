import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { map, catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';

import { hash } from 'app/services/crypto.service';
import { WindowRefService } from 'app/window-ref.service';

const api_key = "rzp_test_lzrrcON3EuW3nI";
const api_secret = "caFrU097wpTYMi0xQgcCfonJ"



@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  //private url: string = 'http://localhost:4000/api/checkout';
  private url: string = 'https://ccubetest.azurewebsites.net/api/checkout';

  constructor(
    private http: HttpClient,
    private winRef: WindowRefService) {

  }

  promisify = async function promisify(leadData) {
    return new Promise(async (resolve, reject) => {

    });
  }


  createOrder(amount: number) {

    let payload = {
      amount: amount
    };

    console.log(payload);

    return this.http.post(this.url, payload).pipe(
      catchError(this.handleError)
    );
  }

  tryPayment(orderId, amount) {
    var options = {
      "key": api_key, // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "CCube",
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": (response, error) => {
        if (error) {
          console.log('error in payment', error);
          return;
        }
         
        console.log('Payment Success', response)

        let verified = this.verifyOrder(orderId,response.razorpay_payment_id, response.razorpay_signature);

        console.log('Payment verified', verified);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
      },
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#00a5a8"
      }
    };
    var rzp1 = new this.winRef.nativeWindow.Razorpay(options);
    rzp1.open();
  }

  verifyOrder(orderId, paymentId, signature) {

    return hash(orderId + "|" + paymentId, api_secret) == signature;

  }

  // sendOtp(mobile:string, email:string=null) {
  //   let payload = {
  //     mobile,
  //   };

  //   if (email) {
  //     payload['email']=email;
  //   }
  //   return this.http.get(this.url + 'otp/send/' + mobile).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // resendOtp(mobile:string) {
  //   let payload = {
  //     mobile
  //   };
  //   return this.http.get(this.url + 'otp/resend/' + mobile).pipe(
  //   catchError(this.handleError));
  // }

  // verifyOtp(mobile, otp) {
  //   let payload = {
  //     mobile,
  //     otp
  //   };
  //   return this.http.get(this.url + 'otp/verify/' + mobile + "/" + otp).pipe(
  //   catchError(this.handleError));
  // }

  // createUser(mobile, fname, lname, password, email) {

  //   let payload = {
  //     mobile,
  //     name: fname + ' ' + lname,
  //     password:  MD5(password).toString(),
  //     email,
  //     loginType: 'MOBILE',
  //     role: 'PATIENT',
  //     status:'NONE' // s0 or empty // recieved from API 1 // to decide if user creation is needed for existing system or not
  //     };

  //     console.log(payload);

  //     return this.http.post(this.url + 'signUp', payload).pipe (
  //       catchError(this.handleError)
  //     );

  // }

  handleError(error: any) {
    console.error(error);
    return throwError(error);
    //return Observable.throw(error || 'Server error');
  }



}