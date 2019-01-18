import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';
declare var QRCode: any;
@Component({
  selector: 'app-qrcode2',
  templateUrl: './qrcode2.component.html',
  styleUrls: ['./qrcode2.component.css']
})
export class Qrcode2Component implements OnInit {
  code = '';
  constructor(public data: DataService, public http: HttpService) {
    this.getInviteCode();
  }

  getInviteCode() {
    this.http.getInviteCode().subscribe(res => {
      this.code = res.toString();
      const qrcode = new QRCode('qrcode');
      qrcode.makeCode(`${location.origin}/h5option/#/main/signup?code=${res.toString()}`);
    });
  }

  ngOnInit() {

  }
  back() {
    this.data.back();
  }
}
