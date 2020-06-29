import { Component, OnInit, OnDestroy } from '@angular/core';
// import Swiper from 'swiper';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
declare var Swiper: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  list: any;
  timeout: any;
  newslist: any;
  logo = '';
  url = '';
  clickTime = 0;
  responseData: Object;
  notice = {
    title: '',
    content: ''
  };
  hasNotice = false;
  constructor(public data: DataService, public http: HttpService) {
    this.responseData = this.data.responseData;
    this.url = 'http://kcb.kcyuan123.com/h5tncl/';
  }

  ngOnInit() {
    this.logo = this.data.logo;
    const mySwiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      },
    });
    this.generalTrend();
    this.newsList();
    this.getConfig();
  }

  goto3(code, marketType, name) {
    this.data.setSession('stockName', name);
    const temp = marketType === 'SH' ? '1' : '2';
    this.data.setSession('optionCode', code + temp);
    this.data.goto('chartetf');
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

  reload() {
    if (this.clickTime === 0) {
      this.clickTime = new Date().getTime();
    } else if (new Date().getTime() - this.clickTime < 1000) {
      this.clickTime = 0;
      window.location.reload();
    } else {
      this.clickTime = 0;
    }
  }

  close() {
    this.hasNotice = false;
    const month = new Date().getMonth().toString();
    const day = new Date().getDate().toString();
    const date = month + day;
    localStorage.setItem('noticeDate', date);
  }

  getConfig() {
    this.http.getPopInfo().subscribe(res => {
      if (res['resultInfo']) {
        const month = new Date().getMonth().toString();
        const day = new Date().getDate().toString();
        const date = month + day;
        if (date !== localStorage.getItem('noticeDate')) {
          this.hasNotice = true;
          Object.assign(this.notice, res['resultInfo']);
        }
      }
    }, err => {
      this.data.error = err.error;
      this.data.isError();
    });
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

  isUporDown(string) {
    if (string) {
      if (string.indexOf('-') >= 0) {
        return 'isDown';
      } else {
        return '';
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
