import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-appoint',
  templateUrl: './appoint.component.html',
  styleUrls: ['./appoint.component.css']
})
export class AppointComponent implements OnInit {
  date: string;
  dateEnd: string;
  drwt: DataService['drwt'];
  list = [];
  pageNo = 1;
  text = '';
  stopLoad = false;
  constructor(public data: DataService, public http: HttpService) {
    this.text = this.data.getUrl(1) === 'appoint' ? '委托' : '成交';
  }

  ngOnInit() {
    this.dateEnd = this.data.getSessionOrParam('appointDateEnd', this.data.getTime('yyyy-MM-dd', new Date()));
    this.date = this.data.getSessionOrParam('appointDate', this.data.getTime('yyyy-MM-dd', new Date()));
    this.getOrder();
  }

  change() {
    if (!this.data.isNull(this.date) && !this.data.isNull(this.dateEnd)) {
      this.data.setSession('appointDateEnd', this.dateEnd);
      this.data.setSession('appointDate', this.date);
      this.list = [];
      this.pageNo = 1;
      this.getOrder();

    }
  }

  onScroll(e) {
    if (Math.round(e.srcElement.scrollTop + e.srcElement.clientHeight) >= e.srcElement.scrollHeight) {
      if (!this.stopLoad) {
        this.pageNo = this.pageNo + 1;
        this.getOrder();
      }
    }
  }

  back() {
    this.data.back();
  }

  getOrder() {
    const data = {
      createTimeStart: this.date,
      createTimeEnd: this.dateEnd,
      pageNo: this.pageNo,
      pageSize: 20,
    };
    if (new Date(this.dateEnd).getTime() - new Date(this.date).getTime() > 2592000000) {
      this.data.ErrorMsg('查询区间不能超过一个月');
    } else {
      this.http.getHisAppoint(this.text === '委托' ? 'entrust' : 'deal', data).subscribe((res: Array<any>) => {
        if (res.length === 0) {
          this.stopLoad = true;
        } else {
          this.stopLoad = false;
        }
        this.list = this.list.concat(res);
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      });
    }
  }

  goto(data) {
    this.data.setSession('appointType', this.text);
    this.data.setSession('appointUrl', `${this.text === '委托' ? 'entrust/' + data.pkorder : 'deal/' + data.dealno}`);
    this.data.setSession('appointDetail', data);
    this.data.goto('appointDetail');
  }

}
