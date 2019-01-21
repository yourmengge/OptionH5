import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { ClipboardService } from 'ngx-clipboard';
@Component({
  selector: 'app-bankcard',
  templateUrl: './bankcard.component.html',
  styleUrls: ['./bankcard.component.css']
})
export class BankcardComponent implements OnInit {
  amount: any;
  remark: any;
  userName: any;
  payType: any;
  cardInfro = { 'bankAccountName': '', 'bankCardNo': '', 'bankName': '', bankBranch: '', aliyPay: '', aliyPayName: '', aliyPayCodeUrl: '' };
  constructor(public data: DataService, public http: HttpService, private _clipboardService: ClipboardService) {
    this.amount = this.data.getSession('amount');
    this.userName = this.data.getSession('userName');
    this.payType = this.data.getSession('payType');
  }

  ngOnInit() {
    this.getPayCardInfo();
  }

  copy() {
    this.data.ErrorMsg('备注已复制');
    this._clipboardService.copyFromContent(this.remark);
  }

  copy1(text) {
    this.data.ErrorMsg('已复制');
    this._clipboardService.copyFromContent(text);
  }

  getPayCardInfo() {
    const date = this.data.getTime('yyyy-MM-ddhh:mm:ss', new Date());
    this.http.getPayCardInfo().subscribe(res => {
      this.cardInfro = Object.assign(this.cardInfro, res);
      this.data.setSession('aliyPayCodeUrl', this.cardInfro.aliyPayCodeUrl);
      this.remark = `用户：${this.data.getSession('accountCode')} 姓名：${this.userName} 在 ${date} 充值 ${this.amount} 元`;
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  back() {
    this.data.back();
  }

  pay() {
    this.data.loading = this.data.show;
    this.http.submitBankTrans(this.amount, this.payType === '2' ? 'BANK' : 'ALIPAY').subscribe(res => {
      this.data.loading = this.data.hide;
      if (!this.data.isNull(this.cardInfro.aliyPayCodeUrl) && this.payType !== '2') {
        location.href = './assets/js/pay.html';
      } else {
        // this.data.ErrorMsg('充值已提交，请尽快充值，等待后台审核');
        alert('充值已提交，请尽快充值，等待后台审核');
        setTimeout(() => {
          window.history.go(-2);
        }, 1000);
      }

    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
}
