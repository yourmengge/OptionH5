import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
declare var StockChart: any;
declare var EmchartsMobileTime: any;
declare var EmchartsMobileK: any;
@Component({
  selector: 'app-chartetf',
  templateUrl: './chart-etf.component.html',
  styleUrls: ['./chart-etf.component.css']
})

// 上证指数代码 0000011，深圳成指代码 3990012  创业板 3990062
export class ChartETFComponent implements OnInit, DoCheck, OnDestroy {
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
  staticData2 = {
    highPrice: 0,
    lastPrice: 0,
    lowPrice: 0,
    openPrice: 0,
    preClosePrice: 0,
    stockCode: '',
    stockName: '',
    totalAmount: 0,
    totalVolume: 0,
    upDown: 0,
    upRatio: ''
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
  marketType = '';
  isSecurities = false; // 判断是否为证券代码
  chartHeight = 200;
  marketNumber = 'SH';
  stockCode2 = '';
  constructor(public data: DataService, public http: HttpService) {
    this.stockCode = this.data.getSession('optionCode');
    this.isconnect = false;
    this.data.resetStockHQ();
    this.stockHQ = this.data.stockHQ;
    this.isSecurities = this.stockCode.length === 7 ? true : false;
    if (this.isSecurities) { // 证券代码
      this.stockCode2 = this.stockCode.slice(0, 6);
      this.marketType = '';
      this.staticData.stockName = this.data.getSession('stockName');
      this.chartHeight = 400;
    } else { // 股票代码
      this.marketType = (this.stockCode.substr(0, 1) === '5' || this.stockCode.substr(0, 1) === '6') ? '1' : '2';
      this.chartHeight = 200;
    }
    if (this.stockCode.slice(6, 7) === '1') {
      this.marketNumber = 'SH';
    } else {
      this.marketNumber = 'SZ';
    }

  }

  ngOnDestroy() {
    this.data.clearInterval();
  }
  ngDoCheck() {
    this.stockHQ = this.data.stockHQ;
  }
  ngOnInit() {
    if (!this.isSecurities) {
      // this.subscribeStock();
      this.getStatic();
    } else {
      this.getSecurities();
      this.getFenshituList();
    }
  }

  getSecurities() {
    this.http.getSecurities(this.marketNumber + this.stockCode2).subscribe(res => {
      this.staticData2 = Object.assign(this.staticData2, res);
      this.data.timeoutQoute = setTimeout(() => {
        this.getSecurities();
      }, 30000);
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
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
      code: `${this.stockCode}${this.marketType}`,
      width: document.body.clientWidth,
      height: this.chartHeight,
      dpr: 2,
      showVMark: true
    });
    // 调用绘图方法
    chart.draw();

    this.data.timeoutFenshi = setTimeout(() => {
      this.KLine();
    }, 30000);
  }

  getFenshituList() {
    const chart = new EmchartsMobileTime({
      container: 'chart',
      type: this.chartType,
      code: `${this.stockCode}${this.marketType}`,
      width: document.body.clientWidth,
      height: this.chartHeight,
      dpr: 2
    });
    // 调用绘图方法
    chart.draw();

    this.data.timeoutFenshi = setTimeout(() => {
      this.getFenshituList();
    }, 30000);



    // this.http.fenshituList(this.stockCode).subscribe((res) => {
    //   this.price = [];
    //   this.volumes = [];
    //   Object.keys(res).forEach(key => {
    //     this.price.push(res[key].lastPrice);
    //     this.volumes.push(res[key].totalVolume);
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
    this.data.back();
  }

  // /**
  //  * 订阅股票
  //  */
  // subscribeStock() {
  //   this.http.getGPHQ(this.stockCode, this.data.token).subscribe((res) => {
  //     if (!this.data.isNull(res['resultInfo']['quotation'])) {
  //       this.data.stockHQ = res['resultInfo']['quotation'];
  //     } else {
  //       this.stockHQ = this.data.stockHQ;
  //     }
  //   }, (err) => {
  //     this.data.error = err.error;
  //     this.data.isError();
  //   }, () => {
  //     this.data.Loading(this.data.hide);
  //   });
  // }
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

  filter(num) {
    return (num / 100000000).toFixed(2) + '亿';
  }

  HQColor2(price) {
    if (price !== '--') {
      if (price > this.staticData2.preClosePrice) {
        return 'red';
      } else if (price < this.staticData2.preClosePrice) {
        return 'green';
      } else {
        return '';
      }
    }

  }

  color(string) {

    if (!this.data.isNull(string)) {
      string = string.toString();
      if (string.indexOf('-') >= 0) {
        return 'green';
      } else {
        return 'red';
      }
    }
  }

  goto(url) {
    this.data.searchStockCode = this.stockCode;
    this.data.goto(`main/jiaoyi/${url}`);
  }

}
