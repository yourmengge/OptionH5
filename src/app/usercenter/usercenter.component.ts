import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.css']
})
export class UsercenterComponent implements OnInit {
  public menuList: any;
  public userInfo: DataService['userInfo'];
  constructor(public data: DataService, public http: HttpService) {
    this.menuList = this.data.getCenterMenuList();
  }

  ngOnInit() {
    this.data.clearInterval();
    this.userInfo = this.data.userInfo;
    this.usercenter();
  }

  goto(url) {
    this.data.goto('main/jiaoyi/' + url);
  }

  usercenter() {
    this.http.userCenter().subscribe((res: DataService['userInfo']) => {
      this.userInfo = res;
      this.data.intervalCapital = setTimeout(() => {
        this.usercenter();
      }, 3000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }

  logout() {
    this.data.ErrorMsg('注销成功');
    this.data.removeSession('token');
    this.data.removeSession('opUserCode');
    setTimeout(() => {
      this.data.goto('/');
    }, 1000);
  }

}
