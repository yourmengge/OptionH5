import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-jiaoyi',
  templateUrl: './jiaoyi.component.html',
  styleUrls: ['./jiaoyi.component.css']
})
export class JiaoyiComponent implements DoCheck {
  public url: string;
  public menuList: any;
  public jiaoyiType: string;
  constructor(public data: DataService, public http: HttpService) {
    this.jiaoyiType = this.data.jiaoyiType;
    if (this.data.jiaoyiType === 'BUY') {
      this.menuList = this.data.getCenterMenuList();
    } else {
      this.menuList = this.data.getCenterMenuList2();
    }
  }

  changeType(type) {
    this.data.jiaoyiType = type;
    this.jiaoyiType = type;
    if (this.jiaoyiType === 'BUY') {
      this.menuList = this.data.getCenterMenuList();
    } else {
      this.menuList = this.data.getCenterMenuList2();
    }
    this.getMenu();
  }

  getMenu() {
    const url = this.data.getUrl(3);
    // 判断当前页面是买入还是卖出，如果是其他页面则不做跳转。买入页面时，跳转到卖出页面，卖出页面跳转到买入页面
    if (url === 'sell' || url === 'buy') {
      this.data.goto(`main/jiaoyi/${url === 'sell' ? 'buy' : 'sell'}`);
    }
  }

  ngDoCheck() {
    if (this.data.nowUrl !== this.data.getUrl(3)) {
      this.data.nowUrl = this.data.getUrl(3);
      this.url = this.data.getUrl(3);
      this.data.clearInterval();
    }

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    console.log('destroy');
    this.data.clearInterval();
  }

  goto(url) {
    if (url !== this.data.getUrl(3)) {
      this.http.cancelSubscribe().subscribe(res => {
        console.log(`取消订阅,${this.data.getToken()}`);
      });
      this.data.sellCnt = '';
      this.data.searchStockCode = '';
      this.data.resetStockHQ();
      this.data.removeSession('optionCode');
      this.url = url;
      this.data.goto('main/jiaoyi/' + url);
    }


  }

}
