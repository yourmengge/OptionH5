import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  phone: string;
  password: string;
  inviteCode: any;
  text = '';
  code: string;
  userName = '';
  time = 60;
  url: any;
  html: any;
  agreement = false;
  type: string; // 判断注册还是忘记密码
  constructor(public data: DataService, public http: HttpService) {
    this.phone = '';
    this.code = '';
    this.password = '';
    this.inviteCode = '';
    this.text = '获取验证码';
    this.url = window.location.host;
  }

  ngOnInit() {
    this.newDetail();
    if (window.location.hash.indexOf('?code=') > 0) {
      this.inviteCode = window.location.hash.split('?code=')[1].split('&')[0].replace(/%3D/g, '');
      this.type = this.data.getUrl(2).split('?code=')[0];
    } else {
      this.inviteCode = '';
      this.type = this.data.getUrl(2);
    }

  }

  goto() {
    this.data.goto('main/login');
  }

  getCode() {
    if (this.phone.length !== 11) {
      this.data.ErrorMsg('请输入正确的手机号码');
    } else {
      // 获取验证码
      this.http.getCode(this.type === 'signup' ? 'REGISTER' : 'PWD_RESET', this.phone).subscribe(res => {
        this.data.ErrorMsg('验证码已发送请注意查收');
        this.countDown();
      }, err => {
        this.data.error = err.error;
        this.data.isError();
      });

    }
  }

  newDetail() {
    this.http.newsDetail(1).subscribe(res => {
      this.html = res['body'];
      this.html = this.html.replace(/<img/g, '<img style="max-width: calc(100vw - 20px);"');
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
  back() {
    this.data.back();
  }
  countDown() {
    this.text = `重新获取${this.time}S`;
    if (this.time > 0) {
      setTimeout(() => {
        this.time = this.time - 1;
        this.countDown();
      }, 1000);
    } else {
      this.text = '获取验证码';
      this.time = 60;
    }

  }

  needInvitedCode() {
    if (this.url.indexOf('fjsrgs') > 0) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    // tslint:disable-next-line:max-line-length
    this.userName = this.userName.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    this.password = this.password.trim();
    if (this.userName.length === 0 && this.type === 'signup') {
      this.data.ErrorMsg('请输入昵称');
    } else if (this.phone.length !== 11) {
      this.data.ErrorMsg('请输入正确的手机号码');
    } else if (this.code.length === 0) {
      this.data.ErrorMsg('请输入验证码');
    } else if (this.password.length < 6 || this.password.length > 12 || !this.data.passwordRE.test(this.password)) {
      this.data.ErrorMsg('密码长度必须为6到12位的数字或字母');
    } else if (this.inviteCode.length === 0 && this.needInvitedCode() && this.type === 'signup') {
      this.data.ErrorMsg('请输入邀请码');
    } else {
      if (this.type === 'signup') {
        this.signup();
      } else {
        this.reset();
      }
    }
  }

  signup() {
    const data = {
      userName: this.userName,
      mobile: this.phone,
      password: Md5.hashStr(this.password),
      inviteCode: this.inviteCode,
      verifyCode: this.code
    };
    this.http.signup(data).subscribe(res => {
      this.data.ErrorMsg('注册成功');
      this.data.goto('main/login');
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  book() {
    this.data.gotoId('newdetail', 1);
  }

  reset() {
    const data = {
      mobile: this.phone,
      newPasswd: Md5.hashStr(this.password),
      verifyCode: this.code
    };
    this.http.reset(data).subscribe(res => {
      this.data.ErrorMsg('修改密码成功');
      history.back();
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

}
