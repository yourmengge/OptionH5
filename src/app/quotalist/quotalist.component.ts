import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZixuanComponent } from '../zixuan/zixuan.component';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-quotalist',
  templateUrl: './quotalist.component.html',
  styleUrls: ['./quotalist.component.css']
})
export class QuotalistComponent extends ZixuanComponent {
  date2: any;
  type: any;
  tabsName: string;
  constructor(public data: DataService, public http: HttpService, public activeRoute: ActivatedRoute) {
    super(data, http);
    this.tabsName = this.data.getSession('tabsName');
    this.date2 = this.activeRoute.snapshot.params['id'].split('_')[0];
    this.type = this.activeRoute.snapshot.params['id'].split('_')[1];
    console.log(this.date2);
  }
  back() {
    this.data.back();
  }

  quato(type) {
    this.type = type;
    this.data.clearInterval();
    this.getlist();
  }

  getlist() {
    this.http.getQuotaList(this.date2, this.type, this.data.getSession('tabsValue')).subscribe(res => {
      this.quoteDetail = res['quoteDetail'];
      this.q50eft = res['quote50ETF'];
      this.data.timeoutQoute = setTimeout(() => {
        this.getlist();
      }, 1000);
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
}
