import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { map, catchError } from 'rxjs/operators';

import { Observable, throwError, Subject } from 'rxjs';

import { hash } from 'app/services/crypto.service';
import { WindowRefService } from 'app/window-ref.service';
import { UserService } from './user.service';
import { LoginService } from 'app/login/login.service';

// Test
const api_key = "rzp_test_iw0QQKe6eyEP2g";
const api_secret = "xa1TxbgErELViPesDtnEcgPx"

declare var Razorpay: any;
declare var RazorpayCheckout: any;

// Live
// const api_key = "rzp_live_TuRL1kcjKl8uWp";
// const api_secret = "cBA44yBhjNi3g2oCYI0EkbWF"


const BYPASS_PAYMENT = false;


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  //private url: string = 'http://localhost:4000/api/checkout';
  private domain: string = 'api-ccube.herokuapp.com';
  private url: string = 'https://' + this.domain + '/api/checkout';

  private user: any;



  private checkoutEmitter = new Subject();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private loginService:LoginService,
    private winRef: WindowRefService) {
    this.refreshUser();
  }

  events = function () {

    if (this.checkoutEmitter.closed) {
      this.checkoutEmitter = new Subject();
    }
    return this.checkoutEmitter;
  }

  promisify = async function promisify(leadData) {
    return new Promise(async (resolve, reject) => {

    });
  }

  private refreshUser() {
    this.user = this.userService.getCurrentUser();
  }


  createOrder(amount: number) {

    if (BYPASS_PAYMENT) {
      return new Observable((obs) => {
        obs.next({
          success: true,
          data: {
            id: -1,
          },
        });
        obs.complete();

        return { unsubscribe() { } };
      });
    }

    let payload = {
      amount: amount
    };

    console.log(payload);

    return this.http.post(this.url, payload).pipe(
      catchError(this.handleError)
    );
  }

  payWithRazorpay(order, amount, orderId) {
    var options = {
      "key": api_key, // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "CCube",
      "description": "Service Payment to CCube",
      "image": "https://ccubeco.com/assets/ccube.png",
      "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "prefill": {
        "name": this.user.name,
        "email": this.user.email,
        "contact": this.user.phone
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#00a5a8"
      },
      modal: {
        ondismiss: function () {
          //alert('dismissed')
        }
      }
    };

    var successCallback = (success) => {

      var orderId = success.razorpay_order_id;
      var signature = success.razorpay_signature;
      //alert(JSON.stringify(success));

      try {
        // if (error) {
        //   console.log('error in payment', error);
        //   this.checkoutEmitter.error(error);
        //   return;
        // }



        ////alert('Payment Success: ' + JSON.stringify(response));

        let verified = this.verifyOrder(orderId, success.razorpay_payment_id, success.razorpay_signature);

        console.log('Payment verified', verified);

        this.checkoutEmitter.next({
          success: true,
          order: order
        });
        this.loginService.refreshUser(this.user.phone);
      } catch (e) {
        //alert('Error in Payments ' + e);
        console.log('Error in Payment s Razorpa ', e);
      }
    };

    var cancelCallback = (error) => {
      //alert(error.description + ' (Error ' + error.code + ')');
      console.log('error in payment', error);
      //   this.checkoutEmitter.error(error);
      //   return;
    };


    let o = null;
    let opened = false;

    try {
      if (RazorpayCheckout) {
        console.log('Found Razorpay Checkout');
        RazorpayCheckout.on('payment.success', successCallback)
        RazorpayCheckout.on('payment.cancel', cancelCallback)
        RazorpayCheckout.open(options);
        opened = true;
      }
      
    } catch (ee) {
      console.log('Error in RZRPY Payment', ee);
    }

    try {
      if (Razorpay && !opened) {
        o = Razorpay;

        console.log('Found Razorpay');
        o = new Razorpay(options);
        o.on('payment.success', successCallback);
        o.on('payment.cancel', cancelCallback);
        o.open();
      }

    } catch (ee) {
      console.log('Error in RZRPY Payment', ee);
    }


  }

  tryPayment(order, amount) {
    try {
      if (BYPASS_PAYMENT) {
        this.checkoutEmitter.next({
          success: true,
          order: order,
          user: this.user
        })

        return;
      }

      let orderId = order.id;
      this.refreshUser();

      this.payWithRazorpay(order, amount, orderId);

      // var options = {
      //   "key": api_key, // Enter the Key ID generated from the Dashboard
      //   "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      //   "currency": "INR",
      //   "name": "CCube",
      //   "description": "Service Payment to CCube",
      //   "image": "https://ccubeco.com/assets/ccube.png",
      //   "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      //   "handler": (response, error) => {
      //     try {
      //     if (error) {
      //       console.log('error in payment', error);
      //       this.checkoutEmitter.error(error);
      //       return;
      //     }

      //     //alert('Payment Success: ' + JSON.stringify(response));

      //     let verified = this.verifyOrder(orderId, response.razorpay_payment_id, response.razorpay_signature);

      //     console.log('Payment verified', verified);

      //     this.checkoutEmitter.next({
      //       success: true,
      //       order: order
      //     });
      //   } catch(ee)  {
      //     //alert('Error in Payment Handler: ' + JSON.stringify(ee));
      //   }
      //     // //alert(response.razorpay_payment_id);
      //     // //alert(response.razorpay_order_id);
      //     // //alert(response.razorpay_signature)
      //   },
      //   "prefill": {
      //     "name": this.user.name,
      //     "email": this.user.email,
      //     "contact": this.user.phone
      //   },
      //   "notes": {
      //     "address": "Razorpay Corporate Office"
      //   },
      //   "theme": {
      //     "color": "#00a5a8"
      //   }
      // };
      // var rzp1 = new this.winRef.nativeWindow.Razorpay(options);
      // rzp1.open();
    } catch (e) {
      //alert('Error in Payments Try Paymeny' + e);
      console.log('Error in Payment s Try Paymeny ', e);
    }
  }

  verifyOrder(orderId, paymentId, signature) {

    try {
      return hash(orderId + "|" + paymentId, api_secret) == signature;
    } catch (e) {
      //alert('Error in Verify signature' + JSON.stringify(e));
    }

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