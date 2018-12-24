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
  list = [1000, 3000, 5000, 8000, 10000, 20000];
  money: any;
  inputMoney: any;
  payType: any;
  isWeiChat = true;
  showWechatPay = false;
  showYinlianPay = false;
  showAliPay = false;
  showYinlianPay2 = true;
  showAliPay2 = true;
  showAliPay3 = false;
  constructor(public http: HttpService, public data: DataService) {
    this.money = '1000';
    this.inputMoney = '';
    this.payType = 2;
  }

  ngOnInit() {
    this.isWeiXin();
    if (location.host.indexOf('anandakeji') > 0) { // 权盈展示银联支付
      this.showYinlianPay = true;
      this.showWechatPay = true;
      this.showYinlianPay2 = false;
      this.showWechatPay = true;
      this.showAliPay2 = false;
      this.payType = 4;
    }

    if (location.host.indexOf('eastnsd') > 0) { // 东方期权牛时代，展示微信支付
      // this.showWechatPay = true;
      this.payType = 2;
    }

    if (location.host.indexOf('ly50etf') > 0) { // 世纪方略展示支付宝支付
      this.showAliPay = true;
      this.payType = 1;
    }

    if (location.host.indexOf('hankun') > 0 || location.host.indexOf('localhost') >= 0) {
      this.showWechatPay = true;
      this.showYinlianPay = true;
      this.showAliPay = true;
      this.showYinlianPay2 = true;
      this.showAliPay2 = true;
      this.showAliPay3 = true;
      this.payType = 1;
    }
  }

  back() {
    this.data.back();
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
    if (this.data.Decimal(this.money) <= 2 && this.money > 0 && this.money !== null) {
      if (this.payType === 1) { // 支付宝支付
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
      } else if (this.payType === 2 || this.payType === 3) { // 银行卡支付
        this.data.setSession('payType', this.payType);
        this.data.setSession('amount', this.money);
        this.data.goto('bankcard');
      } else if (this.payType === 4) {
        const data = {
          amount: this.money,
          channel: '华阳信通'
        };
        this.data.loading = true;
        this.http.thirdPay(data).subscribe(res => {
          this.data.loading = false;
          this.data.gotoId('qrcode', res);
        });
      } else if (this.payType === 5) {
        const data = {
          amount: this.money,
          channel: '银联'
        };
        this.http.thirdPay(data).subscribe(res => {
          const div = document.createElement('div');
          div.innerHTML = res;
          document.body.appendChild(div);
          document.forms[0].submit();
        });
      } else if (this.payType === 6) {
        const data = {
          amount: this.money,
          channel: '支付宝'
        };
        this.data.loading = true;
        this.http.thirdPayBCAT(data).subscribe(res => {
          location.href = res.toString();
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        });
      }
    } else {
      this.data.ErrorMsg('充值金额必须大于0，最多两位小数');
    }
  }

  selectPayType(type) {
    this.payType = type;
  }

}
