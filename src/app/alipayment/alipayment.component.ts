import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-alipayment',
  templateUrl: './alipayment.component.html',
  styleUrls: ['./alipayment.component.css']
})
export class AlipaymentComponent implements OnInit {

  constructor(public http: HttpService, public data: DataService) { }

  ngOnInit() {
    this.http.aliPay(this.data.getSession('alipaymoney')).subscribe(res => {
      // 支付方法
      console.log(res);
      const div = document.createElement('div');
      res = res.replace('name="punchout_form"', 'name="punchout_form" target="myiframe" ');
      div.innerHTML = res;
      document.body.appendChild(div);
      document.forms[0].submit();
    });
  }

  back() {
    this.data.redirectTo('#/recharge');
  }

}
