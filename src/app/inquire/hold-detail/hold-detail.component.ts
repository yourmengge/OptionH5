import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-hold-detail',
  templateUrl: './hold-detail.component.html',
  styleUrls: ['./hold-detail.component.css']
})
export class HoldDetailComponent implements OnInit {
  detail: any;
  url = '';
  constructor(public data: DataService) {
    this.url = this.data.getUrl(1);
  }

  ngOnInit() {
    if (this.url === 'holdDetail') {
      this.detail = JSON.parse(this.data.getSession('holdDetail'));
    } else {
      this.detail = JSON.parse(this.data.getSession('settleDetail'));
    }
    console.log(this.detail);

  }

  back() {
    this.data.back();
  }

}
