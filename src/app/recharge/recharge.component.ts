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
  cardConfig = [false, false, false, false, false, false, false, false, false];
  configName = ['alipay_online', 'alipay', 'bank', 'quanying_wechat', 'quanying_unionpay', 'alipay_bcat', 'hb_wechat', 'hongbo', 'joinpay'];
  config: any;
  payWayConfig = [];
  showText = false;
  constructor(public http: HttpService, public data: DataService) {
    this.money = this.list[0];
    this.inputMoney = '';
    this.payType = -1;
  }

  ngOnInit() {
    this.getRechargeMoney();
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

  getRechargeMoney() {
    this.http.getRechargeMoney().subscribe((res: Array<any>) => {
      this.list = res['resultInfo'].split(',');
      this.money = this.list[0];
    });
  }

  getCardConfig() {
    this.http.getCardConfig().subscribe(res => {
      const array: Array<any> = res['resultInfo'].split(',');
      array.forEach(element => {
        const data = {
          index: 1,
          name: '',
          pic: '',
          type: '',
          fee: ''
        };
        data.type = element;
        switch (element) {
          case 'pay_qrcode':
            data.name = '扫码支付（线上）';
            data.pic = 'bank';
            data.index = 13;
            // data.fee = '0.6%';
            break;
          case 'alipay_online':
            data.name = '支付宝支付';
            data.pic = 'ali';
            data.index = 1;
            data.fee = '0.6%';
            break;
          case 'alipay':
            data.name = '支付宝支付（线下）';
            data.pic = 'ali';
            data.index = 2;
            this.showText = true;
            break;
          case 'bank':
            data.name = '银行卡转账（线下）';
            data.pic = 'bank';
            this.showText = true;
            data.index = 3;
            break;
          case 'quanying_wechat':
            data.name = '华阳信通支付(微信)';
            data.pic = 'wechat';
            data.index = 4;
            break;
          case 'quanying_unionpay':
            data.name = '银联';
            data.pic = 'yinlian';
            data.index = 5;
            break;
          case 'alipay_bcat':
            data.name = '支付宝支付';
            data.pic = 'ali';
            data.index = 6;
            break;
          case 'hb_wechat':
            data.name = '微信支付';
            data.pic = 'wechat';
            data.index = 7;
            data.fee = '0.6%';
            break;
          case 'hongbo':
            data.name = '第三方支付';
            data.pic = 'yinlian';
            data.index = 8;
            break;
          case 'joinpay':
            data.name = '汇聚支付';
            data.pic = 'yinlian';
            data.index = 9;
            data.fee = '0.3%';
            break;
          case 'allscoreQuick':
            data.name = '商银信-快捷认证支付';
            data.pic = 'yinlian';
            data.index = 10;
            data.fee = '0.6%';
            break;
          case 'allscoreB2CWap':
            data.name = '商银信-标准快捷支付';
            data.pic = 'yinlian';
            data.index = 11;
            data.fee = '0.6%';
            break;
          case 'allscoreB2C':
            data.name = '商银信-B2C网关在线支付';
            data.pic = 'yinlian';
            data.index = 12;
            data.fee = '0.4%';
            break;
          default:
            data.name = '';
        }
        if (data.name !== '') {
          this.payWayConfig.push(data);
          this.payType = this.payWayConfig[0].index;
        }

        // console.log(this.payWayConfig);
      });
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
          this.data.setSession('alipaymoney', this.money);
          this.data.goto('alipayment');
        }
      } else if (this.payType === 2 || this.payType === 3) { // 银行卡支付
        this.data.setSession('payType', this.payType);
        this.data.setSession('amount', this.money);
        this.data.goto('bankcard');
      } else if (this.payType === 4) { // 跳转到二维码页面
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
      } else if (this.payType === 5) { // 打开银联支付
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
      } else if (this.payType === 6) { // 跳转到返回的链接
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
      } else if (this.payType === 7) { // 跳转到二维码页面
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
      } else if (this.payType === 8) { // 跳转到返回链接
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
      } else if (this.payType === 9 || this.payType === 10 || this.payType === 11 || this.payType === 12) { // 跳转到短信确认支付页面
        if (this.payType === 9) {
          this.data.setSession('payment-type', 'thirdpayJoinpay');
        } else if (this.payType === 10) {
          this.data.setSession('payment-type', 'thirdpayAllscoreQuick');
        } else if (this.payType === 11) {
          this.data.setSession('payment-type', 'thirdpayAllscoreB2CWap');
        } else if (this.payType === 12) {
          this.data.setSession('payment-type', 'thirdpayAllscoreB2C');
        }
        this.data.setSession('payment-money', this.money);
        this.data.goto('payment');
      } else if (this.payType === 13) { // 跳转到扫码链接
        this.data.loading = true;
        this.http.submitBankTrans(this.money, 'BANK').subscribe(res => {
          this.data.ErrorMsg('提交成功,请尽快转账');
          this.data.goto('pay-qrcode');
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
        }, () => {
          this.data.loading = false;
        });
      } else {
        this.data.ErrorMsg('充值金额必须大于0，最多两位小数');
      }
    }
  }

  selectPayType(type) {
    this.payType = type;
  }

}
