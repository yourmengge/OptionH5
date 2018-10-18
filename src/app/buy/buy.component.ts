import { Component, DoCheck, OnDestroy } from '@angular/core';
import { DataService, StockList } from '../data.service';
import { HttpService } from '../http.service';
import { Response } from '@angular/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css'],
    animations: [
        trigger('showDelete', [
            state('inactive', style({
                height: 0,
                opacity: 0
            })),
            state('active', style({
                height: '400px',
                opacity: 1
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class BuyComponent implements DoCheck, OnDestroy {
    text: string;
    text2: string;
    classType: string;
    show = 'inactive';
    stockCode = '';
    appointPrice: any;
    appointCnt: any;
    ccount: any;
    fullcount: any;
    minPrice: number;
    maxPrice: number;
    stockHQ: any;
    list: any;
    stockName: string;
    connectStatus: boolean;
    market = 'market';
    submitAlert: boolean;
    userName: string;
    socketInterval: any;
    lastPrice: any;
    priceType: any;
    ygsxf = 0; // 预估手续费
    constructor(public data: DataService, public http: HttpService) {
        this.fullcount = '--';
        this.maxPrice = 10;
        this.minPrice = 5;
        this.stockHQ = this.data.stockHQ;
        this.appointPrice = '';
        this.connectStatus = false;
        this.submitAlert = this.data.hide;
        this.userName = this.data.getOpUserCode();
        if (!this.data.isNull(this.data.getSession('optionCode'))) {
            if (this.data.getUrl(3) === 'buy') {
                this.text = '买入';
                this.classType = 'BUY';
                this.text2 = '买';
            } else if (this.data.getUrl(3) === 'sell') {
                this.text = '卖出';
                this.classType = 'SELL';
                this.text2 = '卖';
            }
            this.stockCode = this.data.getSession('optionCode');
            this.getGPHQ();
        }
    }

    ngDoCheck() {
        if (this.data.getUrl(3) === 'buy') {
            this.text = '买入';
            this.classType = 'BUY';
            this.text2 = '买';
        } else if (this.data.getUrl(3) === 'sell') {
            this.text = '卖出';
            this.classType = 'SELL';
            this.text2 = '卖';
        }
        this.stockHQ = this.data.stockHQ;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
    }

    /**
     * 选择价格类型
     */
    selectType(type) {
        this.priceType = type;
        switch (type) {
            case 1:
                this.appointPrice = this.stockHQ.lastPrice;
                break;
            case 2:
                this.appointPrice = this.stockHQ.sellLevel.sellPrice01;
                break;
            case 3:
                this.appointPrice = this.stockHQ.buyLevel.buyPrice01;
                break;
            default:
                break;
        }
        this.appointPrice = this.data.roundNum(this.appointPrice, 4);
    }

    /**
     * 获取行情快照
     */
    getQuotation() {
        this.stockName = '';
        this.show = 'active';
        const content = null;
        this.http.searchStock(this.stockCode).subscribe((res) => {
            this.list = res;
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
        if (!this.connectStatus) {

        }
        if (this.stockCode.length === 0) {
            this.show = 'inactive';
            this.clear();
        }
    }

    /**
     * 买入
     */
    buy() {
        if (this.data.isNull(this.stockCode)) {
            this.data.ErrorMsg('合约代码不能为空');
        } else if (this.data.Decimal(this.appointPrice) > 4) {
            this.data.ErrorMsg('委托价格不能超过四位小数');
        } else if (this.data.isNull(this.appointPrice)) {
            this.data.ErrorMsg('委托价格不能为空');
        } else if (parseInt(this.appointCnt, 0) !== this.appointCnt) {
            this.data.ErrorMsg(this.text + '数量必须是整数');
        } else if (this.appointCnt > this.fullcount) {
            this.data.ErrorMsg(this.text + '数量必须小于可' + this.text2 + '股数');
        } else if (this.appointCnt <= 0) {
            this.data.ErrorMsg(this.text + '数量必须大于0');
        } else if (this.appointCnt > 30) {
            this.data.ErrorMsg(this.text + '数量不能大于30张');
        } else {
            this.submitAlert = this.data.show;
            this.http.commission().subscribe(res => {
                this.ygsxf = parseFloat(res.toString()) * this.appointCnt;
            });
        }

    }

    /**
     * 买入确认
     */
    submintBuy() {
        this.data.Loading(this.data.show);
        const content = {
            'stockCode': this.stockCode,
            'appointCnt': this.appointCnt,
            'appointPrice': this.appointPrice
        };
        this.http.order(this.classType, content, this.classType === 'BUY' ? 'OPEN' : 'CLOSE').subscribe((res: Response) => {
            if (res['success']) {
                this.data.ErrorMsg('委托已提交');
                this.closeAlert();
                this.clear();
            }
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
            this.closeAlert();
        }, () => {
            this.data.Loading(this.data.hide);
            this.closeAlert();
            this.clear();
        });
    }

    /**
     * 关闭弹窗
     */
    closeAlert() {
        this.submitAlert = this.data.hide;
    }

    /**
     * 增加减少买入价
     */
    count(type) {
        if (!this.data.isNull(this.appointPrice)) {
            this.appointPrice = parseFloat(this.appointPrice);
            if (type === -1 && this.appointPrice > 0) {
                this.appointPrice = this.appointPrice - 0.0001;
            } else if (type === 1) {
                this.appointPrice = this.appointPrice + 0.0001;
            }
            this.appointPrice = parseFloat(this.appointPrice.toFixed(4));
        }
    }

    /**
     * 增加减少买入量
     */
    count2(type) {
        this.ccount = '';
        if (!this.data.isNull(this.appointCnt)) {
            if (type === -1 && this.appointCnt > 0) {
                this.appointCnt = this.appointCnt - 1;
            } else if (type === 1) {
                this.appointCnt = this.appointCnt + 1;
            }
        }
    }

    /**
     * 清空
     */
    clear() {
        this.stockCode = '';
        this.appointPrice = '';
        this.appointCnt = '';
        this.ccount = '';
        this.stockName = '';
        this.fullcount = '--';
        this.priceType = 0;
        this.data.resetStockHQ();
        this.stockHQ = this.data.stockHQ;
        this.cancelSubscribe();
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
     * 选择买入量
     */
    selectCount(count) {
        this.ccount = count;
        this.appointCnt = count;
    }

    /**
     * 选取价格
     */
    selectPrice(price) {
        if (typeof (price) === 'string') {
            this.appointPrice = parseFloat(price);
        } else {
            this.appointPrice = price;
        }
        this.appointPrice = this.data.roundNum(this.appointPrice, 4);
    }

    /**
     * 模糊查询选择股票
     */
    selectGP(data: StockList) {
        this.stockCode = data.stockCode;
        this.appointPrice = '';
        this.getGPHQ();
    }

    // 选中合约
    getGPHQ() {
        this.priceType = 1;
        this.appointCnt = 1;
        this.ccount = '';
        this.show = 'inactive';
        this.http.getGPHQ(this.classType, this.stockCode, this.classType === 'BUY' ? 'OPEN' : 'CLOSE').subscribe((res) => {
            if (!this.data.isNull(res['resultInfo']['quotation'])) {
                this.data.stockHQ = res['resultInfo']['quotation'];
                this.fullcount = res['resultInfo']['maxAppointCnt'];
                this.stockName = this.data.stockHQ.stockName;
                this.appointPrice = this.data.roundNum(this.data.stockHQ.lastPrice, 4);
            } else {
                this.stockHQ = this.data.stockHQ;
            }

        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }


    totalPrice(a, b) {
        if (!this.data.isNull(a) && !this.data.isNull(b)) {
            return this.data.roundNumber(a * b * 10000);
        } else {
            return '------';
        }
    }
    /**
     * 返回行情加个颜色
     */
    HQColor(price) {
        if (price !== '--') {
            if (price > this.stockHQ.preClosePrice) {
                return 'red';
            } else if (price < this.stockHQ.preClosePrice) {
                return 'green';
            } else {
                return '';
            }
        }

    }

    /**
     * 输入买入量
     */
    inputCnt() {
        this.ccount = '';
    }
}
