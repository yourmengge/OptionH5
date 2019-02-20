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

  sell(a) {
    this.http.appointSELL(a.stockCode, 'SELL').subscribe(res => {
      this.data.ErrorMsg('已委托，待成交');
      this.caozuo = -1;
      this.getlist();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
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
    this.getlist();
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
