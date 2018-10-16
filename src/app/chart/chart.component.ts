import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
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
export class ChartComponent implements OnInit, DoCheck {
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
    exercisePrice: '',
    preClosePrice: ''
  };
  constructor(public data: DataService, public http: HttpService) {
    this.stockCode = this.data.getSession('optionCode');
    this.isconnect = false;
    this.data.resetStockHQ();
    this.stockHQ = this.data.stockHQ;
  }
  ngDoCheck() {
    this.stockHQ = this.data.stockHQ;
  }
  ngOnInit() {
    this.subscribeStock();
    this.getStatic();
  }

  getStatic() {
    this.http.getStatic(this.stockCode).subscribe(res => {
      this.staticData = Object.assign(this.staticData, res);
      this.getFenshituList();
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
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
      preClosePrice: parseFloat(this.staticData.preClosePrice)
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
        this.data.stockHQ = res['resultInfo']['quotation'];
      } else {
        this.stockHQ = this.data.stockHQ;
      }
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
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
