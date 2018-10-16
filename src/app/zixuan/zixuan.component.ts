import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-zixuan',
  templateUrl: './zixuan.component.html',
  styleUrls: ['./zixuan.component.css'],
})
export class ZixuanComponent implements OnInit {
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
  }


  goto(code) {
    this.data.setSession('optionCode', code);
    this.data.clearInterval();
    this.data.goto('chart');
  }

  change(date) {
    this.date = date;
    this.data.clearInterval();
    this.getlist();
  }

  getDate() {
    this.http.heyuezhouqi().subscribe(res => {
      this.dateList = res;
      this.date = res[0];
      this.getlist();
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
        this.getlist();
      }, 3000);
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
