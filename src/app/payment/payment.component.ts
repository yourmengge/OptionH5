import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  @ViewChild('myInput') myInput: ElementRef;
  // paymentInfo = {
  //   amount: 0.01,
  //   userName: '张萌立',
  //   mobile: 13305020974,
  //   idCard: '350301199406180018',
  //   bankCard: '6222620720008415546'
  // };
  paymentInfo = {
    amount: 0,
    userName: '',
    mobile: '',
    idCard: '',
    bankCard: ''
  };
  second = 60;
  secondText = this.second + '秒后';
  t: any;
  codeDiv = false;
  code = '';
  num0 = '';
  num1 = '';
  num2 = '';
  num3 = '';
  num4 = '';
  num5 = '';
  smsCode = '';
  constructor(public http: HttpService, public data: DataService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.paymentInfo.amount = this.data.getSession('payment-money');
    //  this.myInput.nativeElement.focus();
    // console.log(this.myInput);
  }

  keyup() {
    // this.code = this.num0 + this.num1 + this.num2 + this.num3 + this.num4 + this.num5;
    // if (this.code.length === 6) {
    //   this.http.smsCode(this.code).subscribe(res => {
    //     console.log(res);
    //     this.close();
    //     this.code = '';
    //   }, (err) => {
    //     this.code = '';
    //     this.data.error = err.error;
    //     this.data.isError();
    //   });
    // }
    if (this.smsCode.length === 6) {
      this.http.smsCode(this.smsCode).subscribe(res => {
        this.data.ErrorMsg('订单已创建：接收成功');
        setTimeout(() => {
          history.go(-2);
        }, 1000);
      }, (err) => {
        this.smsCode = '';
        this.data.error = err.error;
        this.data.isError();
      });
    }
  }
  submit() {
    this.http.payment(this.paymentInfo).subscribe(res => {
      this.codeDiv = true;
      this.secondCountDown();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
    // console.log(this.myInput);
    // this.codeDiv = true;
    // this.secondCountDown();
  }

  back() {
    this.data.back();
  }

  close() {
    this.second = 60;
    this.codeDiv = false;
    clearInterval(this.t);
  }

  resend() {
    this.secondCountDown();
  }

  secondCountDown() {
    this.second = 60;
    this.t = setInterval(() => {
      this.second--;
      this.secondText = this.second + '秒后';
      if (this.second === 0) {
        this.secondText = '';
        clearInterval(this.t);
      }
    }, 1000);
  }

}
