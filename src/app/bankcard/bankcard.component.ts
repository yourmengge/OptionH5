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
  cardInfro = { 'bankAccountName': '', 'bankCardNo': '', 'bankName': '', bankBranch: '' };
  constructor(public data: DataService, public http: HttpService) {
    this.amount = this.data.getSession('amount');
  }

  ngOnInit() {
    this.getPayCardInfo();
  }

  getPayCardInfo() {
    this.http.getPayCardInfo().subscribe(res => {
      this.cardInfro = Object.assign(this.cardInfro, res);
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
