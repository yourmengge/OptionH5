import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
declare var QRCode: any;
@Component({
  selector: 'app-qrcode2',
  templateUrl: './qrcode2.component.html',
  styleUrls: ['./qrcode2.component.css']
})
export class Qrcode2Component implements OnInit {
  code = '';
  constructor(public data: DataService) {
    this.code = '123sdfsds';
  }

  ngOnInit() {
    const qrcode = new QRCode('qrcode');
    qrcode.makeCode(this.code);
  }
  back() {
    this.data.back();
  }
}
