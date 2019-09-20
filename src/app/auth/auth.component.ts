import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  paymentInfo = {
    name: '',
    mobile: '',
    idCard: '',
    accountNo: ''
  };
  onlyRead = false;

  constructor(public http: HttpService, public data: DataService) { }

  ngOnInit() {
    this.initData();
  }

  back() {
    this.data.back();
  }

  initData() {
    this.http.getAuth().subscribe(res => {
      if (!this.data.isNull(res)) {
        this.paymentInfo.mobile = res['mobile'];
        this.paymentInfo.name = res['realName'];
        this.paymentInfo.accountNo = res['bankCard'];
        this.paymentInfo.idCard = res['identityCard'];
        this.onlyRead = true;
      } else {
        this.onlyRead = false;
      }
    });
  }

  submit() {
    if (this.onlyRead) {
      this.back();
    } else {
      if (this.paymentInfo.name === '') {
        this.data.ErrorMsg('请输入姓名');
      } else if (this.paymentInfo.mobile === '') {
        this.data.ErrorMsg('请输入手机号');
      } else if (this.paymentInfo.idCard === '') {
        this.data.ErrorMsg('请输入身份证号');
      } else if (this.paymentInfo.accountNo === '') {
        this.data.ErrorMsg('请输入银行卡号');
      } else {
        this.data.loading = true;
        this.http.auth(this.paymentInfo).subscribe(res => {
          this.data.ErrorMsg('认证成功');
          this.data.loading = false;
          this.data.redirectTo('#/main/usercenter');
        }, (err) => {
          this.data.loading = false;
          this.data.error = err.error;
          this.data.isError();
        });
      }
    }
  }

}
