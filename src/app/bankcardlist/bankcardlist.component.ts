import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-bankcardlist',
  templateUrl: './bankcardlist.component.html',
  styleUrls: ['./bankcardlist.component.css']
})
export class BankcardlistComponent implements OnInit {
  list = [];
  constructor(public data: DataService, public http: HttpService) { }

  ngOnInit() {
    this.getList();
  }

  back() {
    this.data.back();
  }

  goto(cardId = '') {
    this.data.setSession('cardId', cardId);
    this.data.goto('card');
  }

  getList() {
    this.http.getCardList().subscribe((res: Array<any>) => {
      this.list = res;
    });
  }

  del(id) {
    if (confirm('确定删除该银行卡')) {
      this.http.delCard(id).subscribe(res => {
        this.data.ErrorMsg('删除成功');
        this.getList();
      });
    }
  }

  defaultCard(id) {
    if (confirm('确定设置为默认银行卡')) {
      this.http.defaultCard(id).subscribe(res => {
        this.data.ErrorMsg('设置成功');
        this.getList();
      });
    }
  }
}
