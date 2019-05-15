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
  delayFeeLock: any;
  constructor(public data: DataService, public http: HttpService) {
    this.backableScale = this.data.getSession('backscale');
    this.delayFeeLock = this.data.getSession('delayFeeLock');
  }

  ngOnInit() {

  }

  back() {
    this.data.back();
  }

  goto(url) {
    if (url === 'transfer') {
      this.http.getCard().subscribe(res => {
        if (this.data.isNull(res)) {
          this.data.setSession('cardId', '');
          this.data.ErrorMsg('请先绑定银行卡');
          this.data.goto('card');
        } else {
          this.data.goto(url);
        }
      });
    } else {
      this.data.goto(url);
    }

  }
}
