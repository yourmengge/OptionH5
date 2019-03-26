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
    bankCard: '',
    bankCode: ''
  };
  second = 60;
  secondText = this.second + '秒后';
  t: any;
  codeDiv = false;
  logo = '';
  code = '';
  num0 = '';
  num1 = '';
  num2 = '';
  num3 = '';
  num4 = '';
  num5 = '';
  smsCode = '';
  type = '';
  bankList = [];
  showBank = false;
  bankId = '';
  save = true;
  bankLimit = [{
    name: '工商银行',
    money: '5k/笔',
    money2: '2w'
  }, {
    name: '中国银行',
    money: '1w/笔',
    money2: '1w'
  }, {
    name: '兴业银行',
    money: '5w/笔',
    money2: '5w'
  }, {
    name: '中信银行',
    money: '5w/笔',
    money2: '5w'
  }, {
    name: '上海银行',
    money: '5w/笔',
    money2: '5w'
  }, {
    name: '光大银行',
    money: '5k/笔',
    money2: '5k'
  }, {
    name: '民生银行',
    money: '2w/笔',
    money2: '2w'
  }, {
    name: '北京银行',
    money: '5k/笔',
    money2: '5k'
  }, {
    name: '平安银行',
    money: '5w/笔',
    money2: '5w'
  }, {
    name: '交通银行',
    money: '1w/笔',
    money2: '1w'
  }, {
    name: '招商银行',
    money: '5k/笔',
    money2: '5k'
  }, {
    name: '广发银行',
    money: '1w/笔',
    money2: '1w'
  }, {
    name: '建设银行',
    money: '5w/笔',
    money2: '5w'
  }, {
    name: '农业银行',
    money: '2k/笔',
    money2: '1w'
  }, {
    name: '浦发银行',
    money: '5w/笔',
    money2: '5w'
  }];
  constructor(public http: HttpService, public data: DataService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.logo = this.data.logo;
    if (!this.data.isNull(this.data.getLocalStorage('PayInfo'))) {
      Object.assign(this.paymentInfo, JSON.parse(this.data.getLocalStorage('PayInfo')));
    }
  }

  ngOnInit() {
    this.paymentInfo.amount = this.data.getSession('payment-money');
    this.type = this.data.getSession('payment-type');
    if (this.type === 'thirdpayAllscoreB2CWap' || this.type === 'thirdpayAllscoreB2C') {
      this.showBank = true;
      this.http.getBankList2(this.type).subscribe(res => {
        let temp = { value: '', text: '' };
        const resultInfo: Array<any> = res['resultInfo'].split(';');
        resultInfo.forEach(element => {
          temp = { value: '', text: '' };
          temp.value = element.split('-')[0];
          temp.text = element.split('-')[1];
          this.bankList.push(temp);
        });
        this.bankId = this.paymentInfo.bankCode || this.bankList[0].value;
      });
    } else {
      this.showBank = false;
      this.paymentInfo.bankCode = '';
    }
    //  this.myInput.nativeElement.focus();
    // console.log(this.myInput);
  }

  keyup(e) {
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
    if (e.length === 6) {
      this.http.smsCode(e, this.type).subscribe(res => {
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
    if (this.type === 'thirdpayJoinpay' || this.type === 'thirdpayAllscoreQuick') {
      this.http.payment(this.paymentInfo, this.type).subscribe(res => {
        this.codeDiv = true;
        this.secondCountDown();
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      });
    } else { // 需要选择银行
      this.paymentInfo.bankCode = this.bankId;
      this.http.payment2(`${this.type}/order`, this.paymentInfo).subscribe(res => {
        const div = document.createElement('div');
        div.innerHTML = res;
        document.body.appendChild(div);
        document.forms[0].submit();
      });
    }
    if (this.save) {
      this.data.setLocalStorage('PayInfo', JSON.stringify(this.paymentInfo));
    } else {
      this.data.setLocalStorage('PayInfo', '');
    }
    this.codeDiv = true;
    this.secondCountDown();
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
