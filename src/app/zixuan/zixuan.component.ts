import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-zixuan',
  templateUrl: './zixuan.component.html',
  styleUrls: ['./zixuan.component.css'],
})
export class ZixuanComponent implements OnInit, OnDestroy {
  hasZixuan = this.data.hide;
  zixuanList: any;
  zixuanArray = [];
  list: any;
  dateList: any;
  date: String;
  quote50ETF: any;
  quoteDetail: any;
  tabsValue: string;
  tabsName: string;
  q50eft = {
    lastPrice: '',
    upDiff: '',
    upRatio: '',
    stockCode: ''
  };
  tabs = [];
  constructor(public data: DataService, public http: HttpService) { }

  ngOnInit() {
    this.getTabs();
    this.cancelSubscribe();
  }

  /**
* 取消订阅
*/
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      this.data.resetStockHQ();
      console.log(`取消订阅,${this.data.getTokenP()}`);
    });
  }

  ngOnDestroy() {
    this.data.clearInterval();
  }


  goto(code) {
    this.data.setSession('optionCode', code);
    this.data.goto('chart');
  }

  change(date) {
    this.date = date;
    this.data.clearInterval();
    this.data.setSession('dateType', date);
    this.getlist();
  }

  quato(type) {
    this.data.gotoId('quatolist', this.date + '_' + type);
  }
  changeTabs(index) {
    this.tabsValue = this.tabs[index].value;
    this.tabsName = this.tabs[index].text;
    this.data.setSession('tabsIndex', index);
    this.data.removeSession('dateType');
    clearTimeout(this.data.timeoutQoute);
    this.getDate();
  }
  getTabs() {
    this.http.getTabs().subscribe((res: Array<any>) => {
      this.tabs = res;
      const index = !this.data.isNull(this.data.getSession('tabsIndex')) ? this.data.getSession('tabsIndex') : 0;
      this.data.setSession('tabsIndex', index);
      this.tabsValue = this.tabs[index].value;
      this.tabsName = this.tabs[index].text;
      this.getDate();
    })
  }

  getDate() {
    this.http.heyuezhouqi(this.tabsValue).subscribe(res => {
      this.dateList = res;
      this.date = !this.data.isNull(this.data.getSession('dateType')) ? this.data.getSession('dateType') : this.date = res[0];
      if (!this.data.isNull(this.date)) {
        this.getlist();
      }
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  getlist() {
    this.http.heyueList(this.date, this.tabsValue).subscribe(res => {
      this.quoteDetail = res['quoteDetail'];
      this.q50eft = res['quote50ETF'];
      this.data.timeoutQoute = setTimeout(() => {
        if (this.data.isPerfectTime()) { // 在8：00~16：00之间刷新
          this.getlist();
        }
      }, 1000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  color(string) {
    if (string) {
      if (string.indexOf('-') >= 0) {
        return 'green';
      } else {
        return 'red';
      }
    }
  }


}
