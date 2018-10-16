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
  constructor(public data: DataService, public http: HttpService) {
    this.alert = this.data.alert;
    this.loading = this.data.loading;
  }

  ngOnInit() {
    this.connect();
  }
  /**
  * 取消订阅
  */
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      console.log('取消订阅');
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
    this.cancelSubscribe();
    const socket = new SockJS(this.http.ws);
    const headers = { token: this.data.getToken() };
    this.stompClient = over(socket);
    this.stompClient.connect(headers, function (frame) {
      that.stompClient.subscribe('/user/' + that.data.getToken() + '/topic/market', function (res) {
        that.data.stockHQ = JSON.parse(res.body);
      });
    }, function (err) {
      console.log('err', err);
    });
  }
  ngDoCheck() {
    this.alert = this.data.alert;
    this.loading = this.data.loading;
  }
}
