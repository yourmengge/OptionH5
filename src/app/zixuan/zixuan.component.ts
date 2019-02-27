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
  q50eft = {
    lastPrice: '',
    upDiff: '',
    upRatio: '',
    stockCode: ''
  };
  constructor(public data: DataService, public http: HttpService) { }

  ngOnInit() {
    this.getDate();
    this.cancelSubscribe();
  }

  /**
* 取消订阅
*/
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      this.data.resetStockHQ();
      console.log(`取消订阅,${this.data.getToken()}`);
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

  getDate() {
    this.http.heyuezhouqi().subscribe(res => {
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
    this.http.heyueList(this.date).subscribe(res => {
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
