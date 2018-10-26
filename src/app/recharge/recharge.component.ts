import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
declare var _AP: any;
@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {
  list = [100, 200, 500, 800, 1000, 2000];
  money: any;
  inputMoney: any;
  payType: any;
  isWeiChat = true;
  constructor(public http: HttpService, public data: DataService) {
    this.money = '100';
    this.inputMoney = '';
    this.payType = 1;
  }

  ngOnInit() {
    this.isWeiXin();
    console.log(this.data.getToken());
  }

  back() {
    window.history.back();
  }

  input() {
    this.money = this.inputMoney;
  }

  select(money) {
    this.money = money;
    this.inputMoney = '';
  }

  isWeiXin() {
    const ua = window.navigator.userAgent.toLowerCase();
    console.log(ua);
    if ((/MicroMessenger/i).test(ua)) {
      this.isWeiChat = true;
    } else {
      this.isWeiChat = false;
    }
  }


  pay() {
    if (this.payType === 1) { // 支付宝支付
      if (this.data.Decimal(this.money) <= 2 && this.money > 0) {
        if (this.isWeiChat) {
          _AP.pay(this.http.host + `/alipay/sign?totalAmount=${this.money}&token=${this.data.getToken()}`);
        } else {// 普通浏览器
          this.http.aliPay(this.money).subscribe(res => {
            // 支付方法
            const div = document.createElement('div');
            div.innerHTML = res;
            document.body.appendChild(div);
            document.forms[0].submit();
          });
        }

      } else {
        this.data.ErrorMsg('充值金额必须大于0，最多两位小数');
      }
    } else { // 银行卡支付
      this.data.setSession('amount', this.money);
      this.data.goto('bankcard');
    }
  }

  selectPayType(type) {
    this.payType = type;
  }

}
