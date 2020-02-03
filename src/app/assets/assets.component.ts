import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
declare var layer: any;
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit, OnDestroy {
  type = 0;
  list: any;
  isJiaoyi: any;
  resData: any;
  caozuo = -1;
  Interval: any;
  stopWin = 0;
  stopLose = 0;
  stopWinRate = '0%';
  stopLoseRate = '0%';
  stopDiv = false;
  stockCode;
  pkOrder;
  preClosePrice: number;
  limitTime: string;
  constructor(public data: DataService, public http: HttpService) { }

  ngOnDestroy() {
    window.clearInterval(this.Interval);
  }
  ngOnInit() {
    if (this.data.getUrl(2) === 'chicang') {
      this.isJiaoyi = false;
    } else {
      this.isJiaoyi = true;
    }
    this.getlist();
    this.Interval = setInterval(() => {
      this.getlist();
    }, 3000);

    this.http.getBankList2('CTRL_PROFIT_TIME').subscribe(res => {
      this.limitTime = res['resultInfo'] || '09:30~15:00';
    });
  }

  submitAlert(a) {
    layer.open({
      content: `确定以市价一键平仓吗？`
      , btn: ['确定', '取消']
      , yes: (index) => {
        layer.close(index);
        this.sell(a);
      }
    });
  }

  stopWinOrLose(data) {
    this.stockCode = data.stockCode;
    this.pkOrder = data.pkOrder;
    this.preClosePrice = data.preClosePrice;
    this.http.getStopData(this.pkOrder).subscribe(res => {
      this.stopWin = res['upprice'];
      this.stopLose = res['downprice'];
    });
    this.stopDiv = true;
  }

  detail(code) {
    this.data.setSession('optionCode', code);
    this.data.goto('chart');
  }

  sell(a) {
    this.http.appointSELL(a.stockCode, 'SELL', a.pkOrder || '').subscribe(res => {
      this.data.ErrorMsg('已委托，待成交');
      this.caozuo = -1;
      this.getlist();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  winOrLostRate(price) {
    if (price === 0) {
      return '0%';
    } else {
      return ((price - this.preClosePrice) / this.preClosePrice * 100).toFixed(2) + '%';
    }
  }

  select(a, type) {
    this.data.searchStockCode = a.stockCode;
    this.data.sellCnt = a.stockCntAble;
    if (location.href.indexOf('chicang') > 0) {
      this.data.goto(`main/jiaoyi/${type}`);
    }
  }

  changeType(type) {
    this.type = type;
    this.caozuo = -1;
    this.getlist();
  }

  closeStop() {
    this.stopDiv = false;
  }

  add(type, value) {
    if (type < 0) { // 点击减按钮
      if (value === 0) { // 止盈
        this.stopWin = this.stopWin <= 0 ? 0 : this.formatRound4(this.stopWin - 0.0001);
      } else { // 止损
        this.stopLose = this.stopLose <= 0 ? 0 : this.formatRound4(this.stopLose - 0.0001);
      }
    } else { // 点击加按钮
      if (value === 0) { // 止盈
        this.stopWin = this.formatRound4(this.stopWin + 0.0001);
      } else { // 止损
        this.stopLose = this.formatRound4(this.stopLose + 0.0001);
      }
    }
  }

  submitStop() {
    if (this.stopWin < 0 || this.stopLose < 0) {
      this.data.ErrorMsg('设置的止盈止损价格不能小于0');
    } else if (!this.data.isPerfectTime(this.limitTime)) {
      this.data.ErrorMsg(`只能在${this.limitTime}时间内设置`);
    } else {
      const data = {
        stockcode: this.stockCode,
        pkorder: this.pkOrder,
        downprice: this.stopLose,
        upprice: this.stopWin
      };
      this.http.submitStopData(data).subscribe(res => {
        this.data.ErrorMsg('设置成功');
        this.closeStop();
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      });
    }
  }

  formatRound4(num) {
    return Math.round(num * 10000) / 10000;
  }

  getlist() {
    if (this.type === 1) { // 分笔持仓
      this.http.holdDetail().subscribe(res => {
        this.list = res;
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      });
    } else {
      this.http.getHold().subscribe(res => {
        this.list = res;
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      });
    }
  }

}
