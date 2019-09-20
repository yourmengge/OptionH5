import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.css']
})
export class UsercenterComponent implements OnInit, OnDestroy {
  public menuList: any;
  public userInfo: DataService['userInfo'];
  public logo = 'hk';
  authFlag = '0';
  constructor(public data: DataService, public http: HttpService) {
    this.menuList = this.data.getCenterMenuList();
  }
  ngOnDestroy() {
    this.data.clearInterval();
  }
  ngOnInit() {
    this.logo = this.data.logo;
    this.data.clearInterval();
    this.userInfo = this.data.userInfo;
    this.usercenter();
  }

  goto(url) {
    this.data.goto('main/jiaoyi/' + url);
  }

  usercenter() {
    this.data.loading = this.data.show;
    this.http.getCertifyFlag().subscribe(res => {
      this.authFlag = res['resultInfo'];
    });
    this.http.userCenter().subscribe((res: DataService['userInfo']) => {
      this.userInfo = res;
      this.data.setSession('accountCode', res['accountCode']);
      this.data.setSession('userName', res['accountName']);
      this.data.setSession('backscale', res['liftAble']);
      this.data.setSession('delayFeeLock', res['delayFeeLock']);
      this.data.intervalCapital = setTimeout(() => {
        this.usercenter();
      }, 60000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.loading = this.data.hide;
    });
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

  setting() {
    this.data.goto('setting');
  }

  logout() {
    this.cancelSubscribe();
    this.data.ErrorMsg('注销成功');
    this.data.isConnect = false;
    this.data.token = this.data.randomString(32);
    this.data.removeSession('opUserCode');
    setTimeout(() => {
      this.data.goto('main/login');
    }, 1000);
  }

  goto2(url) {
    // authFlag认证标志（0 不认证；1 充值；2 提现；12 充值提现）
    if (url === 'withdraw') { // 提现
      if (this.authFlag === '2' || this.authFlag === '12') { // 判断是否需要实名认证
        this.http.getAuth().subscribe(res => {
          if (this.data.isNull(res)) { // 未完成实名
            this.data.ErrorMsg('请先完成实名认证');
            this.data.goto('auth');
          } else {
            this.getCard(url);
          }
        });
      } else {
        this.getCard(url);
      }
    } else if (url === 'recharge') { // 充值
      if (this.authFlag === '1' || this.authFlag === '12') { // 判断是否需要实名认证
        this.http.getAuth().subscribe(res => {
          if (this.data.isNull(res)) { // 未完成实名
            this.data.ErrorMsg('请先完成实名认证');
            this.data.goto('auth');
          } else {
            if (this.data.logo === 'dfqq') {
              this.getCard(url);
            } else {
              this.data.goto(url);
            }
          }
        });
      } else { // 不需要实名认证
        if (this.data.logo === 'dfqq') { // 东方期权需要先
          this.getCard(url);
        } else {
          this.data.goto(url);
        }
      }
    } else {
      this.data.goto(url);
    }

  }

  getCard(url) {
    this.http.getCard().subscribe(res => {
      if (this.data.isNull(res)) {
        this.data.setSession('cardId', '');
        this.data.ErrorMsg('请先绑定银行卡');
        this.data.goto('card');
      } else {
        this.data.goto(url);
      }
    });
  }

}
