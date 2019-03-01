import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-settle-page',
  templateUrl: './settle-page.component.html',
  styleUrls: ['./settle-page.component.css']
})
export class SettlePageComponent implements OnInit {
  date: string;
  list = [];
  text = '';
  url = '';
  constructor(public data: DataService, public http: HttpService) {
    this.url = this.data.getUrl(1);
    this.text = this.url === 'settleClose' ? '平仓' : '开仓';
  }

  ngOnInit() {
    this.date = this.data.getSessionOrParam('settleDate', this.data.getTime('yyyy-MM-dd', new Date()));
    this.getOrder();
  }

  change() {
    if (!this.data.isNull(this.date)) {
      this.data.setSession('settleDate', this.date);
      this.list = [];
      this.getOrder();

    }
  }

  back() {
    this.data.back();
  }

  getOrder() {
    const data = {
      dealdate: this.data.getTime('yyyyMMdd', this.date)
    };
    this.http.settleMent(this.url, data).subscribe((res: Array<any>) => {
      this.list = this.list.concat(res);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  goto(data) {
    this.data.setSession('settleDetail', JSON.stringify(data));
    this.data.goto(this.url + 'Detail');
  }
}
