import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

  back() {
    this.data.back();
  }

  logout() {
    this.data.ErrorMsg('注销成功');
    this.data.isConnect = false;
    this.data.token = this.data.randomString(32);
    this.data.removeSession('opUserCode');
    setTimeout(() => {
      this.data.goto('main/login');
    }, 1000);
  }

  goto(url) {
    if (url === 'card') {
      this.data.setSession('updateCard', true);
    }
    this.data.goto(url);
  }

}
