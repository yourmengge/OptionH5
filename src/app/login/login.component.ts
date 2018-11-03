import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logo = 'login';
  public phone: string;
  public password: string;
  public header = {
    'Authorization': ''
  };
  constructor(public data: DataService, public http: HttpService) {
  }

  ngOnInit() {
    this.data.setSession('token', '');
    this.data.clearInterval();
    if (window.location.host.indexOf('eastnsd') > 0) { // 东方期权
      this.logo = 'dfqq';
    } else if (window.location.host.indexOf('fjsrgs') > 0) {
      this.logo = 'zgb';
    } else {
      this.logo = 'login';
    }
  }

  login() {
    if (this.phone === '') {
      this.data.ErrorMsg('请输入登录账号');
    } else if (this.password === '') {
      this.data.ErrorMsg('请输入登录密码');
    } else {
      const body = {
        'username': this.phone,
        'password': Md5.hashStr(this.password)
      };
      this.data.loading = this.data.show;
      this.http.login(body).subscribe((res) => {
        console.log(res);
        this.data.setSession('opUserCode', this.phone);
        this.data.opUserCode = this.phone;
        this.data.token = res['resultInfo'];
        this.data.setSession('token', this.data.token);
        // this.header = {
        //   'Authorization': res['itg']['token']
        // };
        // const headers: Headers = new Headers(this.header);
        // this.http.opts = new RequestOptions({ headers: headers });
        // this.data.setSession('header', JSON.stringify(this.header));
        this.data.goto('main/usercenter');
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      }, () => {
        this.data.loading = this.data.hide;
      });

    }
  }

  goto(type) {
    this.data.goto('main/' + type);
  }
}
