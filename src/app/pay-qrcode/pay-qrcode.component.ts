import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-pay-qrcode',
  templateUrl: './pay-qrcode.component.html',
  styleUrls: ['./pay-qrcode.component.css']
})
export class PayQrcodeComponent implements OnInit {
  img: string;
  tips: string;
  constructor(public data: DataService, public http: HttpService) {
    this.img = '';
    this.tips = '';
  }

  ngOnInit() {
    this.http.getBankList2('PAY_QRCODE_URL').subscribe(res => {
      this.img = res['resultInfo'];
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
    this.http.getBankList2('PAY_QRCODE_DESC').subscribe(res => {
      this.tips = res['resultInfo'];
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  back() {
    this.data.back();
  }

}
