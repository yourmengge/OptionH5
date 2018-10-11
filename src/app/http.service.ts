import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as SockJS from 'sockjs-client';
import { DataService } from './data.service';

@Injectable()
export class HttpService {
  stompClient: any;
  public host = 'http://218.85.23.217:8082/option/';
  // public host = 'http://101.132.65.124:10008/option/';
  public ws = this.host + 'webSocket';
  public stockHQ: any;

  constructor(public http: HttpClient, public data: DataService) {
  }

  POST(url, data) {
    this.data.getHeader();
    return this.http.post(url, data, this.data.getHeader());
  }

  /**
   * 请求股票行情
   */
  getGPHQ(type, code, stockType) {
    return this.POST(this.host + `push/subsMarket/${type}/${code}/${stockType}`, {});
  }

  /**
 * 获取手续费
 */
  commission() {
    return this.POST(this.host + 'commission', {});
  }


  /**
   * 登录接口
   */
  login(data) {
    return this.http.post(this.host + 'login', data);
  }

  /**
   * 模糊查询股票
   */
  searchStock(code) {
    return this.POST(this.host + 'stock?input=' + code, {});
  }

  /**
   * 下单 参数 买入：BUY 卖出：SELL
   */
  order(type, data, stockType) {
    return this.POST(this.host + 'appoint/' + type + '/' + stockType, data);
  }

  /**
   * 取消订阅
   */
  cancelSubscribe() {
    return this.POST(this.host + 'push/unsubsMarket', {});
  }

  /**
   * 查询持仓
   */
  getHold() {
    return this.POST(this.host + 'hold', {});
  }

  /**
   * 查询委托
   */
  getAppoint(time) {
    return this.POST(this.host + 'appointHis?' + time, {});
  }

  /**
   * 个人中心
   */
  userCenter() {
    return this.POST(this.host + 'capital', {});
  }

  /**
   * 确认撤单
   */
  chedan(code) {
    return this.POST(this.host + 'cancel/' + code, {});
  }

  /**
   * 自选股订阅
   */
  zixuanSubscribe(string) {
    return this.http.post(this.host + 'push/subscribe/' + string, {}, this.data.getHeader());
  }

  /**
   * 获取自选股行情
   */
  zixuanDetail(string) {
    return this.http.post(this.host + 'push/self/' + string, {}, this.data.getHeader());
  }
}
