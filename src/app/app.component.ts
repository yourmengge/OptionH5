import { Component, DoCheck, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import * as SockJS from 'sockjs-client';
import { over } from '@stomp/stompjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck, OnInit {
  alert = true;
  title = 'app';
  loading = true;
  stompClient: any;
  socket: any;
  constructor(public data: DataService, public http: HttpService) {
    this.alert = this.data.alert;
    this.loading = this.data.loading;
  }

  ngOnInit() {
    if (this.data.isNull(this.data.getToken())) {
      this.data.token = this.data.randomString(32);
      this.data.setLocalStorage('token', this.data.token);
    }
    this.socket = new SockJS(this.http.ws);
    this.stompClient = over(this.socket);
    this.connect();
  }
  /**
  * 取消订阅
  */
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      this.data.resetStockHQ();
      console.log(`取消订阅,${this.data.getToken()}`);
    });
  }
  /**
      * 断开连接
      */
  disconnect() {
    this.stompClient.disconnect((() => {
      console.log('断开链接');
    }));
  }
  /**
   * 连接ws
   */
  connect() {
    console.log('发起ws请求');
    const that = this;
    const headers = { token: this.data.getToken() };
    this.stompClient.connect(headers, function (frame) {
      console.log('连接成功');
      that.connectWs();
    }, function (err) {
      console.log('连接失败');
    });
    this.socket.onclose = function () {
      console.log('断开了');
      that.connect();
      if (that.data.getUrl(1) === 'chart' || that.data.getUrl(3) === 'buy' || that.data.getUrl(3) === 'sell') {
        if (!that.data.isNull(that.data.searchStockCode)) {
          that.http.getGPHQ(that.data.searchStockCode, that.data.getToken()).subscribe(res => {

          });
        }
      }
    };
  }

  connectWs() {
    const that = this;
    that.stompClient.subscribe('/user/' + that.data.getToken() + '/topic/market', function (res) {
      that.data.stockHQ = JSON.parse(res.body);
    });
  }

  ngDoCheck() {
    this.alert = this.data.alert;
    this.loading = this.data.loading;
    if (!this.data.isConnect) {
      this.data.isConnect = true;
      if (this.data.getLocalStorage('token') !== this.data.getToken()) {
        this.data.setLocalStorage('token', this.data.token);
        this.connectWs();
      }
    }

  }
}
