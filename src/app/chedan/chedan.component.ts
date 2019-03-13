import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chedan',
  templateUrl: './chedan.component.html',
  styleUrls: ['./chedan.component.css']
})
export class ChedanComponent implements OnInit {

  public userInfo: DataService['userInfo'];
  list: any;
  type: any;
  orderData = {
    stockName: '',
    stockCode: '',
    appointCnt: '',
    appointPrice: '',
    appointTypeDesc: '',
    appointOrderCode: '',
    dealCnt: '',
    productCode: '',
    pkOrder: ''
  };
  clickTime: any;
  submitAlert: boolean;
  constructor(public data: DataService, public http: HttpService) {
    this.submitAlert = this.data.hide;
  }

  ngOnInit() {
    this.userInfo = this.data.userInfo;
    this.usercenter();
    this.getOrder();

    this.clickTime = new Date().getTime();
  }

  usercenter() {
    this.http.userCenter().subscribe((res: DataService['userInfo']) => {
      this.userInfo = res;
      this.data.intervalCapital = setTimeout(() => {
        this.usercenter();
      }, 3000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }

  chedan(orderdata) {
    this.submitAlert = this.data.show;
    this.orderData = Object.assign(this.orderData, orderdata);
    this.type = orderdata.appointTypeDesc;
  }

  getOrder() {
    const today = this.data.getTime('yyyyMMdd', new Date());
    this.http.getAppoint(`ing=true&date=${today}`).subscribe((res) => {
      this.list = res;
      // tslint:disable-next-line:forin
      // for (const i in this.list) {
      //   this.list[i].appointTime = this.toTime(this.list[i].appointTime);
      // }
      this.data.intervalAppoint = setTimeout(() => {
        this.getOrder();
      }, 3000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }

  /**
  * 关闭弹窗
  */
  closeAlert() {
    this.submitAlert = this.data.hide;
  }

  /**
   * 确认撤单
   */
  submitChedan() {
    if (!this.data.isNull(this.orderData.appointOrderCode)) {
      const data = {
        productCode: this.orderData.productCode,
        pkOrder: this.orderData.pkOrder
      };
      this.http.chedan({ list: [data] }).subscribe((res) => {
        console.log(res);
        this.data.ErrorMsg('撤单已提交');
        this.closeAlert();
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
      }, () => {
        this.data.Loading(this.data.hide);
      });
    } else {
      this.data.ErrorMsg('撤单失败');
      this.closeAlert();
    }
  }

}

