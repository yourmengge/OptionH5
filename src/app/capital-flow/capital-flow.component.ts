import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-capital-flow',
  templateUrl: './capital-flow.component.html',
  styleUrls: ['./capital-flow.component.css']
})
export class CapitalFlowComponent implements OnInit {
  startDate: any;
  endDate: any;
  list = [];
  pageNo = 1;
  stopLoad = false;
  constructor(public data: DataService, public http: HttpService) {
    this.startDate = this.data.getTime('yyyy-MM-dd', new Date(this.data.beforeMonth()));
    this.endDate = this.data.getTime('yyyy-MM-dd', new Date());
  }

  ngOnInit() {
    this.getlist();
  }

  change() {
    if (new Date(this.startDate).getTime() <= new Date(this.endDate).getTime()) {
      this.list = [];
      this.pageNo = 1;
      this.getlist();
    } else {
      this.data.ErrorMsg('开始日期必须大于结束日期');
    }

  }


  back() {
    this.data.back();
  }

  onScroll(e) {
    if (Math.round(e.srcElement.scrollTop + e.srcElement.clientHeight) >= e.srcElement.scrollHeight) {
      if (!this.stopLoad) {
        this.pageNo = this.pageNo + 1;
        this.getlist();
      }
    }
  }

  getlist() {
    const data = {
      createTimeStart: this.startDate,
      createTimeEnd: this.endDate,
      pageNo: this.pageNo,
      pageSize: 20,
    };
    this.http.getFlow(data).subscribe((res: Array<any>) => {
      if (res.length === 0) {
        this.stopLoad = true;
      } else {
        this.stopLoad = false;
      }
      this.list = this.list.concat(res);
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  fontColor(type, num: number) {
    if (type === 2 || (type === 3 && num < 0)) {
      return 'blue';
    } else {
      return '';
    }
  }

  borderColor(type, num: number) {
    if (type === 2 || (type === 3 && num < 0)) {
      return 'blueBorder';
    } else {
      return '';
    }
  }

  color(status) {
    if (status === 1) {
      return 'status green';
    } else if (status === -1) {
      return 'status';
    } else {
      return 'status blue';
    }
  }
}
