import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-inquire',
  templateUrl: './inquire.component.html',
  styleUrls: ['./inquire.component.css']
})
export class InquireComponent implements OnInit {
  isAgent = false;
  gridList = [{
    id: 'hold',
    title: '分笔持仓'
  }, {
    id: 'hold2',
    title: '合并持仓'
  }, {
    id: 'appoint',
    title: '历史委托'
  }, {
    id: 'appoint2',
    title: '历史成交'
  }, {
    id: 'capitalflow',
    title: '资金流水'
  }];

  gridList2 = [{
    id: 'qrcode2',
    title: '推广码'
  }, {
    id: 'member',
    title: '成员列表'
  }];

  constructor(public data: DataService, public http: HttpService) {
  }

  ngOnInit() {
    this.getQrcode();
  }

  getQrcode() {
    this.http.getInviteCode().subscribe(res => {
      if (!this.data.isNull(res)) {
        this.gridList = this.gridList.concat(this.gridList2);
      }
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  back() {
    this.data.back();
  }

  goto(url) {
    this.data.setSession('appointDateEnd', '');
    this.data.setSession('appointDate', '');
    this.data.goto(url);
  }
}
