import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  backableScale: any;
  constructor(public data: DataService, public http: HttpService) {
    this.backableScale = this.data.getSession('backscale');
  }

  ngOnInit() {
    this.http.getCard().subscribe(res => {
      if (this.data.isNull(res)) {
        this.data.ErrorMsg('请先绑定银行卡');
        this.data.goto('card');
      }
    });
  }

  back() {
    window.history.back();
  }

  goto(url) {
    this.data.goto(url);
  }
}
