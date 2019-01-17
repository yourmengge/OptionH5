import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-inquire',
  templateUrl: './inquire.component.html',
  styleUrls: ['./inquire.component.css']
})
export class InquireComponent implements OnInit {

  gridList = [{
    id: 'fbcc',
    title: '分笔持仓',
    needShow: true
  }, {
    id: 'hbcc',
    title: '合并持仓',
    needShow: true
  }, {
    id: 'drwy',
    title: '当日委托',
    needShow: true
  }, {
    id: 'drcj',
    title: '当日成交',
    needShow: true
  }, {
    id: 'capitalflow',
    title: '资金流水',
    needShow: true
  }];

  gridList2 = [{
    id: 'qrcode2',
    title: '推广码',
    needShow: true
  }, {
    id: 'member',
    title: '成员列表',
    needShow: false
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
    this.data.goto(url);
  }
}
