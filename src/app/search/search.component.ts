import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { Response, RequestOptions, Headers } from '@angular/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  dateTime: string;
  time: any;
  drwt: DataService['drwt'];
  selectTime: any;
  list: any;

  constructor(public data: DataService, public http: HttpService) {
    this.time = new Date().getTime();
    this.dateTime = this.data.getTime('yyyy-MM-dd', this.time);
    // this.selectTime = new Date();
  }

  ngOnInit() {
    this.getOrder();
    this.data.intervalAppoint = setInterval(() => {
      this.getOrder();
    }, 3000);
  }

  getOrder() {
    this.http.getAppoint('date=' + this.data.getTime('yyyyMMss', this.time)).subscribe((res) => {
      this.list = res;
      // tslint:disable-next-line:forin
      // for (const i in this.list) {
      //   this.list[i].appointTime = this.toTime(this.list[i].appointTime);
      // }
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }

  change(type) {
    if (type === -1) {
      this.time = this.time - 86400000;
    } else {
      this.time = this.time + 86400000;
    }
    this.dateTime = this.data.getTime('yyyy-MM-dd', this.time);
    this.getOrder();
  }

  select() {
    console.log(this.selectTime);
    if (this.selectTime !== '') {
      this.dateTime = this.selectTime;
      this.time = new Date(this.selectTime).getTime();
      this.getOrder();
    }

  }

  // toTime(time) {
  //   if (time.length === 6) {
  //     return time.substr(0, 2) + ':' + time.substr(2, 2) + ':' + time.substr(4, 2);
  //   } else {
  //     return time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2);
  //   }
  // }

}
