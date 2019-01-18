import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-hold',
  templateUrl: './hold.component.html',
  styleUrls: ['./hold.component.css']
})
export class HoldComponent implements OnInit {
  url: string;
  text: string;
  list: any;
  constructor(public data: DataService, public http: HttpService) {
    this.url = this.data.getUrl(1);
    this.text = this.url === 'hold' ? '分笔' : '合并';
    this.getlist();
  }

  ngOnInit() {
  }

  getlist() {
    if (this.text === '分笔') {
      this.http.holdDetail().subscribe(res => {
        this.list = res;
      });
    } else {
      this.http.getHold().subscribe(res => {
        this.list = res;
      });
    }
  }

  back() {
    this.data.back();
  }

  goto(data) {
    this.data.setSession('holdDetail', JSON.stringify(data));
    this.data.goto('holdDetail');
  }

}
