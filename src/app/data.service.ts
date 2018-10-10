import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable()

export class DataService {

  alert = false;
  loading = false;
  errMsg = '出错啦';
  error: Error;
  show = true;
  hide = false;
  token: string;
  intervalCapital: any; // 个人中心
  intervalHold: any;  // 持仓
  intervalAppoint: any; // 委托
  intervalZX: any; // 自选股
  nowUrl: string;
  market: 'market'; // 行情的ws，header

  /**
   * 股票行情
   */
  stockHQ = {
    'closePrice': '',
    'highPrice': '',
    'lowPrice': '',
    'lastPrice': '',
    'openPrice': '',
    'orderTime': '',
    'preClosePrice': '',
    'stockCode': '',
    'buyLevel': {
      'buyPrice01': '--',
      'buyPrice02': '--',
      'buyPrice03': '--',
      'buyPrice04': '--',
      'buyPrice05': '--',
      'buyPrice06': '--',
      'buyPrice07': '--',
      'buyPrice08': '--',
      'buyPrice09': '--',
      'buyPrice10': '--',
      'buyVolume01': '--',
      'buyVolume02': '--',
      'buyVolume03': '--',
      'buyVolume04': '--',
      'buyVolume05': '--',
      'buyVolume06': '--',
      'buyVolume07': '--',
      'buyVolume08': '--',
      'buyVolume09': '--',
      'buyVolume10': '--'
    },
    'sellLevel': {
      'sellPrice01': '--',
      'sellPrice02': '--',
      'sellPrice03': '--',
      'sellPrice04': '--',
      'sellPrice05': '--',
      'sellPrice06': '--',
      'sellPrice07': '--',
      'sellPrice08': '--',
      'sellPrice09': '--',
      'sellPrice10': '--',
      'sellVolume01': '--',
      'sellVolume02': '--',
      'sellVolume03': '--',
      'sellVolume04': '--',
      'sellVolume05': '--',
      'sellVolume06': '--',
      'sellVolume07': '--',
      'sellVolume08': '--',
      'sellVolume09': '--',
      'sellVolume10': '--'
    }

  };
  /**
   * 当日委托数据类型
   */
  drwt = {
    'accountCode': '',
    'appointCnt': 900,
    'appointOrderCode': '',
    'appointPrice': '',
    'appointStatus': '',
    'appointStockCode': '',
    'appointTime': '',
    'appointType': 1,
    'dealAvrPrice': '',
    'dealCnt': 900,
    'isVritual': 1,
    'memo': '',
    'pkOrder': '',
    'productCode': '',
    'teamCode': ''
  };
  /**
 * 用户信息
 */
  userInfo = {
    allottedScale: 0, // 初期规模
    ableScale: 0,  // 可用资金
    accountName: 'mario', // 中文名
    lockScale: 0, // 冻结资金
    stockScale: 0, // 股票市值
    totalScale: 0 // 总资产
  };

  opUserCode: string;

  constructor(public router: Router) {
    if (this.getSession('userInfo') !== null) {
      this.opUserCode = this.getSession('opUserCode');
      const response = this.getSession('userInfo');
      this.token = '';
    }
  }

  /**
   * 获取当前url最后的参数
   */
  getUrl(num) {
    return window.location.hash.split('/')[num];
  }


  /**
   * 页面跳转
   */
  goto(url) {
    return this.router.navigate([url]);
  }

  /**
   * 判断有几位小数
   */
  Decimal(num) {
    num = num + '';
    if (num.indexOf('.') !== -1) {
      return num.split('.')[1].length;
    } else {
      return 0;
    }
  }

  /**
   * 底部菜单栏
   */
  getFooterMenu() {
    return [{
      //   id: 'zixuan',
      //   name: '自选',
      //   title: '自选',
      //   class: 'zixuan'
      // }, {
      id: 'jiaoyi',
      name: '交易',
      title: '交易',
      class: 'jiaoyi'
    }, {
      id: 'usercenter',
      name: '个人',
      title: '个人中心',
      class: 'geren'
    }];
  }

  /**
   * 获取个人中心菜单列表
   */
  getCenterMenuList() {
    return [{
      id: 'buy',
      name: '买入',
      class: ''
    }, {
      id: 'sell',
      name: '卖出',
      class: 'sell'
    }, {
      id: 'chedan',
      name: '撤单',
      class: 'chedan'
    }, {
      id: 'chicang',
      name: '持仓',
      class: 'chicang'
    }, {
      id: 'search',
      name: '查询',
      class: 'search'
    }];
  }

  /**
   * 生成请求body
   */
  reqBody(data, apiCode, opUserCode) {
    const req = {
      itg: {
        content: data,
        infCode: apiCode,
        msgTime: this.getTime('yyyyMMddhhmmss', new Date()),
        msgType: 0,
        opUserCode: opUserCode,
        opUserType: 6,
        reqNo: this.getTime('yyyyMMddhhmmss', new Date()),
        reqSource: 'human_channel'
      }
    };
    return req;

  }

  /**
   * 获取当前时间：毫秒
   */
  getTime(type, time) {
    time = new Date(time);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const millseconds = time.getMilliseconds();
    switch (type) {
      case 'yyyyMMddhhmmss':
        return year + this.add0(month).toString() + this.add0(day) +
          this.add0(hour) + this.add0(minutes) + this.add0(seconds) + this.add0(millseconds);
      case 'yyyy-MM-dd':
        return year + '-' + this.add0(month) + '-' + this.add0(day);
      case 'yyyyMMss':
        return year + this.add0(month).toString() + this.add0(day);
    }
  }

  /**
   * 个位数补充0
   */
  add0(num) {
    return num < 10 ? '0' + num : num;
  }

  getSession(name): any {
    return sessionStorage.getItem(name);
  }
  setSession(name, data) {
    return sessionStorage.setItem(name, data);
  }

  removeSession(name) {
    return sessionStorage.removeItem(name);
  }

  getLocalStorage(name) {
    return localStorage.getItem(name);
  }

  setLocalStorage(name, data) {
    return localStorage.setItem(name, data);
  }

  /**
   * 请求出错提示
   */
  isError() {
    this.Loading(this.hide);
    this.alert = true;
    setTimeout(() => {
      this.alert = false;
    }, 2000);
    this.errMsg = this.error.resultInfo;
    if (this.error.resultCode === 'token.error') {
      this.removeSession('token');
      this.clearInterval();
      this.goto('/login');
    }
  }

  /**
   * 输入出错提示
   */
  ErrorMsg(desc) {
    this.alert = true;
    setTimeout(() => {
      this.alert = false;
    }, 2000);
    this.errMsg = desc;
  }

  /**
   * 加载中提示
   */
  Loading(type) {
    this.loading = type;
  }

  /**
   * 买入卖出数量向上取整
   */
  roundDown(num) {
    return parseInt((num / 100).toString(), 0) * 100;
  }

  /**
   * 判断是否为空
   */
  isNull(string) {
    // tslint:disable-next-line:max-line-length
    return (string === NaN || string === 'NaN' || string === 'undefined' || string === '' || string === null || string === 'null' || string === undefined || string === 'NaN') ? true : false;
  }

  hadHeader() {
    if (this.getSession('header') !== undefined) {
      const headers = new HttpHeaders(JSON.parse(this.getSession('header')));
      return headers;
    }
  }

  getHeader() {
    if (this.isNull(this.token)) {
      if (this.isNull(this.getSession('token'))) {
        this.clearInterval();
        this.ErrorMsg('请重新登录');
        this.goto('/login');
        return;
      } else {
        this.token = this.getSession('token');
        return { headers: new HttpHeaders({ 'Authorization': this.getSession('token') }) };
      }

    } else {
      return { headers: new HttpHeaders({ 'Authorization': this.token }) };
    }

  }

  getToken() {
    if (this.isNull(this.token)) {
      return this.getSession('token');
    } else {
      return this.token;
    }
  }

  getOpUserCode() {
    if (this.isNull(this.opUserCode)) {
      return this.getSession('opUserCode');
    } else {
      return this.opUserCode;
    }
  }

  /**
   * 限制只能输入数字
   */
  keyup() {
    const k = event['keyCode'];
    if (((k >= 48) && (k <= 57)) || k === 8 || ((k >= 96) && (k <= 105)) || k === 110 || k === 190) {// 限制输入数字

    } else {
      this.preventDefault();
    }
  }

  preventDefault() {
    if (window.event) {
      window.event.returnValue = false;
    } else {
      event.preventDefault(); // for firefox
    }
  }

  /**
   * 判断时间点是否在9：00到11：30，13：00到15：00之间
   */
  isPerfectTime() {
    const time = new Date();
    if (time.getHours() >= 9 && (time.getHours() <= 11 && time.getMinutes() <= 30)) {
      return true;
    }
    if (time.getHours() >= 13 && time.getHours() <= 14) {
      return true;
    }
    return false;
  }

  /**
   * 清除轮询
   */
  clearInterval() {
    window.clearTimeout(this.intervalAppoint);
    window.clearTimeout(this.intervalCapital);
    window.clearTimeout(this.intervalHold);
    window.clearTimeout(this.intervalZX);
  }

  /**
   * 四舍五入
   */
  roundNumber(num) {
    if (!this.isNull(num)) {
      return Math.round(num * 100) / 100;
    } else {
      return '';
    }

  }
}
export interface Error {
  resultCode: string;
  resultInfo: string;
  success: boolean;
}

export interface StockList {
  pinYin: string;
  stockCode: string;
  stockName: string;
}
