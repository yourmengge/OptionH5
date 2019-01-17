import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (location.hash.indexOf('error') !== -1) {
      alert('参数错误，请检查');
    } else {
      const ua = navigator.userAgent.toLowerCase();
      const tip2 = document.getElementById('weixin-tip');
      const tipImg2 = document.getElementById('weixin-tip-img');
      const tip = document.querySelector('.weixin-tip');
      const tipImg = document.querySelector('.J-weixin-tip-img');
      if (ua.indexOf('micromessenger') !== -1) {
        tip2.style.display = 'block';
        tipImg2.style.display = 'block';
        if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('ipod') !== -1) {
          tipImg.className = 'J-weixin-tip-img weixin-tip-img iphone';
        } else {
          tipImg.className = 'J-weixin-tip-img weixin-tip-img android';
        }
      } else {
        location.href = 'https://qr.alipay.com/tsx05619deaj1atwjn5a97c';
      }
    }
  }

}
