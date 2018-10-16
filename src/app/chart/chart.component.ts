import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import * as SockJS from 'sockjs-client';
import { over } from '@stomp/stompjs';
declare var StockChart: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  stockHQ: any;
  stockCode: any;
  socketInterval: any;
  stompClient: any;
  price = [];
  isconnect: boolean;
  preClosePrice: any; // 昨收价
  volumes = [];
  staticData = {
    stockName: '',
    exerciseDate: '',
    leftDays: '',
    exercisePrice: ''
  };
  constructor(public data: DataService, public http: HttpService) {
    this.stockCode = this.data.getSession('optionCode');
    this.isconnect = false;
    this.stockHQ = this.data.stockHQ;
  }

  ngOnInit() {
    this.subscribeStock();
    if (this.stockCode.length === 8) {
      this.connect();
    }
    this.getStatic();
  }

  getStatic() {
    this.http.getStatic(this.stockCode).subscribe(res => {
      this.staticData = Object.assign(this.staticData, res);
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  ngOnDestroy() {
    if (this.isconnect) {
      this.disconnect();
    }
  }

  getFenshituList() {
    this.http.fenshituList(this.stockCode).subscribe((res) => {
      this.price = [];
      this.volumes = [];
      Object.keys(res).forEach(key => {
        this.price.push(res[key].lastPrice);
        this.volumes.push(res[key].incrVolume);
      });
      this.fenshitu();
      this.data.timeoutFenshi = setTimeout(() => {
        this.getFenshituList();
      }, 30000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  fenshitu() {
    console.log(this.stockHQ.preClosePrice);
    StockChart.drawTrendLine({
      id: 'trendLine',
      height: 180,
      width: document.body.clientWidth - 20,
      prices: this.price,
      volumes: this.volumes,
      volumeHeight: 50,
      preClosePrice: parseFloat(this.stockHQ.preClosePrice)
    });
  }

  back() {
    this.data.removeSession('optionCode');
    window.history.back();
  }

  /**
   * 订阅股票
   */
  subscribeStock() {
    this.http.getGPHQ('BUY', this.stockCode, 'OPEN').subscribe((res) => {
      if (!this.data.isNull(res['resultInfo']['quotation'])) {
        this.stockHQ = res['resultInfo']['quotation'];
      } else {
        this.stockHQ = this.data.stockHQ;
      }
      this.getFenshituList();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }
  /**
      * 断开连接
      */
  disconnect() {
    this.stompClient.disconnect((() => {
      console.log('断开链接');
      window.clearInterval(this.socketInterval);
    }));
  }
  /**
     * 取消订阅
     */
  cancelSubscribe() {
    window.clearInterval(this.socketInterval);
    this.http.cancelSubscribe().subscribe((res) => {
      console.log('取消订阅');
    });
  }
  /**
   * 连接ws
   */
  connect() {
    const that = this;
    this.cancelSubscribe();
    const socket = new SockJS(this.http.ws);
    const headers = { token: this.data.getToken() };
    this.stompClient = over(socket);
    this.stompClient.connect(headers, function (frame) {
      that.isconnect = true;
      // console.log('Connected: ' + frame);
      that.stompClient.subscribe('/user/' + that.data.getToken() + '/topic/market', function (res) {
        that.stockHQ = JSON.parse(res.body);
      });
    }, function (err) {
      console.log('err', err);
    });
  }
  /**
     * 返回行情加个颜色
     */
  HQColor(price) {
    if (price !== '--') {
      if (price > this.stockHQ.preClosePrice) {
        return 'red';
      } else if (price < this.stockHQ.preClosePrice) {
        return 'green';
      } else {
        return '';
      }
    }

  }

  goto(url) {
    this.data.goto(`main/jiaoyi/${url}`);
  }

}
