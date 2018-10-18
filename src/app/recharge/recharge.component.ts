import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {
  list = [100, 200, 500, 800, 1000, 2000];
  money: any;
  inputMoney: any;
  constructor(public http: HttpService, public data: DataService) {
    this.money = '100';
    this.inputMoney = '';
  }

  ngOnInit() {
  }

  back() {
    window.history.back();
  }

  input() {
    this.money = this.inputMoney;
  }

  select(money) {
    this.money = money;
    this.inputMoney = '';
  }

  pay() {
    if (this.data.Decimal(this.money) <= 2 && this.money > 0) {
      this.http.aliPay(this.money).subscribe(res => {
        // 支付方法
        const div = document.createElement('div');
        div.innerHTML = res;
        document.body.appendChild(div);
        document.forms[0].submit();
      });
    } else {
      this.data.ErrorMsg('充值金额必须大于0，最多两位小数');
    }

  }

}
