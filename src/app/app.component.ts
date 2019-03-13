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
    this.data.setLocalStorage('tokenP', this.data.randomString(32));
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
      console.log(`取消订阅,${this.data.getTokenP()}`);
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
    let temp = false;
    const that = this;
    const headers = { token: this.data.getTokenP() };
    this.stompClient.connect(headers, function (frame) {
      console.log('连接成功');
      temp = true;
      that.connectWs();
    }, function (err) {
      console.log('连接失败');
    });
    setTimeout(() => {
      if (!temp) {
        this.disconnect();
        this.socket = new SockJS(this.http.ws);
        this.stompClient = over(this.socket);
        this.connect();
        if (!this.data.isNull(this.data.searchStockCode)) {
          if (this.data.getUrl(1) === 'chart') {
            this.http.getGPHQ(this.data.searchStockCode).subscribe(res => {

            });
          } else if (this.data.getUrl(3) === 'buy' || this.data.getUrl(3) === 'sell') {
            this.http.getGPHQ2(this.data.searchStockCode, this.data.getUrl(4)).subscribe(res => {

            });
          }
        }
      }
    }, 10000);
    this.socket.onclose = function () {
      console.log('断开了');
      temp = false;
      that.connect();

    };
  }

  connectWs() {
    const that = this;
    that.stompClient.subscribe('/user/' + that.data.getTokenP() + '/topic/market', function (res) {
      const data = JSON.parse(res.body);
      if (that.data.searchStockCode === data.stockCode || that.data.getSession('optionCode') === data.stockCode) {
        that.data.stockHQ = data;
      }
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
