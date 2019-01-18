import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-inquire',
  templateUrl: './inquire.component.html',
  styleUrls: ['./inquire.component.css']
})
export class InquireComponent implements OnInit {

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

  constructor(public data: DataService) {
    this.gridList = this.gridList.concat(this.gridList2);
  }

  ngOnInit() {
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
