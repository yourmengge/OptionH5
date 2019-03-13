import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
declare var StockChart: any;
declare var EmchartsMobileTime: any;
declare var EmchartsMobileK: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, DoCheck, OnDestroy {
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
  chartTypeList = [{
    name: '分时',
    type: 'T1'
  }, {
    name: '五日',
    type: 'T5'
  }, {
    name: '日K',
    type: 'DK'
  }, {
    name: '周K',
    type: 'WK'
  }, {
    name: '月K',
    type: 'MK'
  }];
  chartType = 'T1';
  constructor(public data: DataService, public http: HttpService) {
    this.stockCode = this.data.getSession('optionCode');
    this.isconnect = false;
    this.data.resetStockHQ();
    this.stockHQ = this.data.stockHQ;
  }

  ngOnDestroy() {
    this.data.clearInterval();
  }
  ngDoCheck() {
    this.stockHQ = this.data.stockHQ;
  }
  ngOnInit() {
    this.subscribeStock();
    this.getStatic();
  }

  changeType(type) {
    window.clearTimeout(this.data.timeoutFenshi);
    this.chartType = type;
    if (this.chartType === 'T1' || this.chartType === 'T5') {
      this.getFenshituList();
    } else {
      this.KLine();
    }
  }

  KLine() {
    const chart = new EmchartsMobileK({
      container: 'chart',
      type: this.chartType,
      code: `${this.stockCode}${this.stockCode.length === 6 ? '1' : '_SO'}`,
      width: document.body.clientWidth,
      height: 200,
      dpr: 2,
      showVMark: true
    });
    // 调用绘图方法
    chart.draw();

    this.data.timeoutFenshi = setTimeout(() => {
      if (this.data.isPerfectTime()) {
        this.KLine();
      }
    }, 30000);
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
    const chart = new EmchartsMobileTime({
      container: 'chart',
      code: `${this.stockCode}${this.stockCode.length === 6 ? '1' : '_SO'}`,
      width: document.body.clientWidth,
      height: 180,
      dpr: 2,
      type: this.chartType
    });
    // 调用绘图方法
    chart.draw();

    this.data.timeoutFenshi = setTimeout(() => {
      if (this.data.isPerfectTime()) {
        this.getFenshituList();
      }
    }, 30000);
    // this.http.fenshituList(this.stockCode).subscribe((res) => {
    //   this.price = [];
    //   this.volumes = [];
    //   Object.keys(res).forEach(key => {
    //     this.price.push(res[key].lastPrice);
    //     this.volumes.push(res[key].incrVolume);
    //   });
    //   this.fenshitu();
    //   this.data.timeoutFenshi = setTimeout(() => {
    //     this.getFenshituList();
    //   }, 30000);
    // }, (err) => {
    //   this.data.error = err.error;
    //   this.data.isError();
    // });
  }

  fenshitu() {
    StockChart.drawTrendLine({
      id: 'trendLine',
      height: 180,
      width: document.body.clientWidth - 20,
      prices: this.price,
      volumes: this.volumes,
      volumeHeight: 50,
      preClosePrice: parseFloat(this.staticData.preClosePrice),
      middleLineColor: 'rgb(169, 126, 0)'
    });
  }

  back() {
    this.data.removeSession('optionCode');
    this.http.cancelSubscribe().subscribe(res => { });
    this.data.back();
  }

  /**
   * 订阅股票
   */
  subscribeStock() {
    this.http.getGPHQ(this.stockCode).subscribe((res) => {
      console.log('订阅成功');
      if (!this.data.isNull(res['resultInfo']['quotation'])) {
        this.data.stockHQ = res['resultInfo']['quotation'];
      } else {
        this.stockHQ = this.data.stockHQ;
      }
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
  /**
     * 返回行情加个颜色
     */
  HQColor(price) {
    if (price !== '--') {
      if (price > this.staticData.preClosePrice) {
        return 'red';
      } else if (price < this.staticData.preClosePrice) {
        return 'green';
      } else {
        return '';
      }
    }

  }

  color(string) {
    if (!this.data.isNull(string)) {
      if (string.indexOf('-') >= 0) {
        return 'green';
      }
    }
  }

  goto(url) {
    this.data.searchStockCode = this.stockCode;
    this.data.goto(`main/jiaoyi/${url}/BUY`);
  }

}
