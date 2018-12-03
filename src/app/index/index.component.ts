import { Component, OnInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  list: any;
  timeout: any;
  newslist: any;
  img = [];
  constructor(public data: DataService, public http: HttpService) {

  }

  ngOnInit() {
    if (this.data.logo === 'dfqq') {
      this.img = [
        './assets/images/banner4.jpg',
        './assets/images/banner5.jpg'
      ];
    } else {
      this.img = [
        './assets/images/banner.jpg',
        './assets/images/banner2.jpg',
        './assets/images/banner3.jpg'
      ];
    }
    const mySwiper = new Swiper('.swiper-container', {
      autoplay: true,
      pagination: {
        el: '.swiper-pagination',
      },
      loop: true,
    });
    this.generalTrend();
    this.newsList();
  }

  newsList() {
    this.http.newsList().subscribe(res => {
      this.newslist = res;
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  ngOnDestroy() {
    window.clearTimeout(this.timeout);
  }

  generalTrend() {
    this.http.generalTrend().subscribe(res => {
      this.list = res;
      this.timeout = setTimeout(() => {
        this.generalTrend();
      }, 60000);
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  color(string) {
    if (string) {
      if (string.indexOf('-') >= 0) {
        return 'green';
      } else {
        return 'red';
      }
    }
  }

  goto(id) {
    this.data.gotoId('newdetail', id);
  }

  goto2(url) {
    this.data.goto('main/' + url);
  }

}
