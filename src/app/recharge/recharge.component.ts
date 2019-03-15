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
  startTime: any;
  endTime: any;
  chargeTime: string;
  chargeRange: string;
  minMoney: any;
  maxMoney: any;
  cardConfig = [false, false, false, false, false, false, false, false];
  configName = ['alipay_online', 'alipay', 'bank', 'quanying_wechat', 'quanying_unionpay', 'alipay_bcat', 'hb_wechat', 'hongbo'];
  config: any;
  constructor(public http: HttpService, public data: DataService) {
    this.money = this.list[0];
    this.inputMoney = '';
    this.payType = -1;
  }

  ngOnInit() {
    this.isWeiXin();
    this.getCardConfig();
    this.http.chargeWithdrawInfo().subscribe(res => {
      this.chargeRange = res['chargeRange'];
      this.chargeTime = res['chargeTime'];
      if (!this.data.isNull(this.chargeRange)) {
        this.minMoney = this.data.splitString(this.chargeRange, '~', 0);
        this.maxMoney = this.data.splitString(this.chargeRange, '~', 1);
      } else {
        this.minMoney = 0;
        this.maxMoney = 0;
      }
      if (!this.data.isNull(this.chargeTime)) {
        this.startTime = this.data.splitString(this.chargeTime, '~', 0);
        this.endTime = this.data.splitString(this.chargeTime, '~', 1);
      } else {
        this.startTime = 0;
        this.endTime = 0;
      }
    });
  }

  getCardConfig() {
    this.http.getCardConfig().subscribe(res => {
      this.config = res['resultInfo'].split(',');
      this.configName.forEach((element, key) => {
        if (this.config.indexOf(element) >= 0) {
          if (this.payType === -1) {
            this.payType = key + 1;
          }
          this.cardConfig[key] = true;
        } else {
          this.cardConfig[key] = false;
        }
      });
      console.log(this.cardConfig);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
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
    const now = this.data.timeToNum(this.data.add0(new Date().getHours()) + ':' + this.data.add0(new Date().getMinutes()));
    if (!this.data.isOnTime(this.startTime, this.endTime, now)) {
      this.data.ErrorMsg(`充值时间必须在${this.chargeTime}之间`);
    } else if (!this.data.isOnTime(this.minMoney, this.maxMoney, this.money)) {
      this.data.ErrorMsg(`充值金额必须在${this.chargeRange}之间`);
    } else if (this.data.Decimal(this.money) <= 2 && this.money > 0 && this.money !== null) {
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
        this.http.thirdPay('thirdpay', data).subscribe(res => {
          this.data.loading = false;
          this.data.gotoId('qrcode', res);
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        }, () => {
          this.data.loading = false;
        });
      } else if (this.payType === 5) {
        const data = {
          amount: this.money,
          channel: '银联'
        };
        this.http.thirdPay('thirdpay', data).subscribe(res => {
          const div = document.createElement('div');
          div.innerHTML = res;
          document.body.appendChild(div);
          document.forms[0].submit();
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        }, () => {
          this.data.loading = false;
        });
      } else if (this.payType === 6) {
        const data = {
          amount: this.money,
          channel: '支付宝'
        };
        this.data.loading = true;
        this.http.thirdPay('thirdpayBCAT', data).subscribe(res => {
          location.href = res.toString();
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        });
      } else if (this.payType === 7) {
        const data = {
          amount: this.money,
          channel: '清算所三方支付'
        };
        this.data.loading = true;
        this.http.thirdPay('thirdpayHBWX', data).subscribe(res => {
          this.data.gotoId('qrcode', res);
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        }, () => {
          this.data.loading = false;
        });
      } else if (this.payType === 8) {
        const data = {
          amount: this.money
        };
        this.data.loading = true;
        this.http.thirdPay('thirdpayHongbo', data).subscribe(res => {
          // this.data.gotoId('qrcode', res);
          location.href = res;
          console.log(res);
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        }, () => {
          this.data.loading = false;
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
