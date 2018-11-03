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
  cardInfro = { 'bankAccountName': '', 'bankCardNo': '', 'bankName': '', bankBranch: '' };
  constructor(public data: DataService, public http: HttpService, private _clipboardService: ClipboardService) {
    this.amount = this.data.getSession('amount');
    this.userName = this.data.getSession('userName');
  }

  ngOnInit() {
    this.getPayCardInfo();
  }

  copy() {
    this.data.ErrorMsg('备注已复制');
    this._clipboardService.copyFromContent(this.remark);
  }

  getPayCardInfo() {
    const date = this.data.getTime('yyyy-MM-ddhh:mm:ss', new Date());
    this.http.getPayCardInfo().subscribe(res => {
      this.cardInfro = Object.assign(this.cardInfro, res);
      this.remark = `用户：${this.data.getSession('opUserCode')} 姓名：${this.userName} 在 ${date} 充值 ${this.amount} 元`;
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  back() {
    window.history.back();
  }

  pay() {
    this.http.submitBankTrans(this.amount).subscribe(res => {
      this.data.ErrorMsg('充值已提交，请尽快充值，等待后台审核');
      setTimeout(() => {
        this.back();
      }, 1000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
}
