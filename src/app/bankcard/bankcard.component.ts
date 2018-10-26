import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-bankcard',
  templateUrl: './bankcard.component.html',
  styleUrls: ['./bankcard.component.css']
})
export class BankcardComponent implements OnInit {
  amount: '';
  bankName = '';
  cardInfro = { 'bankAccountName': '', 'bankCardNo': '', 'bankName': '' };
  constructor(public data: DataService, public http: HttpService) {
    this.amount = this.data.getSession('amount');
  }

  ngOnInit() {
    this.getPayCardInfo();
  }

  getPayCardInfo() {
    this.http.getPayCardInfo().subscribe(res => {
      this.cardInfro = Object.assign(this.cardInfro, res);
      this.bankName = this.cardInfro.bankName.split('-')[0];
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
      this.data.ErrorMsg('您的充值申请已提交，请尽快进行线下支付');
      setTimeout(() => {
        this.back();
      }, 1000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
}
