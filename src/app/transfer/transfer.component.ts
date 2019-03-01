import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  backableScale: any;
  liftScale: string;
  startTime: any;
  endTime: any;
  chargeTime: string;
  chargeRange: string;
  minMoney: any;
  maxMoney: any;
  constructor(public data: DataService, public http: HttpService) {
    this.backableScale = this.data.getSession('backscale');
    this.liftScale = '';
  }

  ngOnInit() {
    this.http.chargeWithdrawInfo().subscribe(res => {
      this.chargeRange = res['widthdrawRange'];
      this.chargeTime = res['widthdrawTime'];
      if (!this.data.isNull(this.chargeRange)) {
        this.minMoney = this.data.splitString(this.chargeRange, '~', 0);
        this.maxMoney = this.data.splitString(this.chargeRange, '~', 1);
      } else {
        this.minMoney = 0;
        this.maxMoney = 0;
      }
      if (!this.data.isNull(this.chargeTime)) {
        this.startTime = this.data.splitString(this.chargeTime, '~', 0);
        this.endTime = this.data.splitString(this.chargeTime, '~', 1);
      } else {
        this.startTime = 0;
        this.endTime = 0;
      }


    });
  }
  back() {
    this.data.back();
  }

  withdraw() {
    const now = this.data.timeToNum(this.data.add0(new Date().getHours()) + ':' + this.data.add0(new Date().getMinutes()));
    if (!this.data.isOnTime(this.startTime, this.endTime, now)) {
      this.data.ErrorMsg(`提现时间必须在${this.chargeTime}之间`);
    } else if (!this.data.isOnTime(this.minMoney, this.maxMoney, this.liftScale)) {
      this.data.ErrorMsg(`提现金额必须在${this.chargeRange}之间`);
    } else if (this.liftScale === '' || parseFloat(this.liftScale) <= 0 || this.data.Decimal(this.liftScale) > 2) {
      this.data.ErrorMsg('提现金额必须大于0，最多两位小数');
    } else if (this.liftScale > this.backableScale) {
      this.data.ErrorMsg('提现金额不能大于余额');
    } else {
      const data = {
        liftScale: this.liftScale
      };
      this.data.loading = this.data.show;
      this.http.withdraw(data).subscribe(res => {
        this.data.ErrorMsg('提现申请已提交');
        this.http.userCenter().subscribe(response => {
          this.backableScale = response['liftAble'];
          this.data.setSession('backscale', this.backableScale);
          this.data.setSession('delayFeeLock', response['delayFeeLock']);
        });
        this.liftScale = '';
      }, err => {
        this.data.error = err.error;
        this.data.isError();
      }, () => {
        this.data.loading = this.data.hide;
      });
    }
  }
}
