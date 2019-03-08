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
    appointCnt: number;
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
    maxAppointCnt = ''; // 最大可买数量
    ableScale = 0; // 可用资金
    ygsxf = 0; // 预估手续费
    commission = 0; // 交易佣金
    gearing = 3; // 杠杆倍数
    jiaoyiType: string; // 卖方或者买方
    baozhengjin = 0;
    constructor(public data: DataService, public http: HttpService) {
        this.jiaoyiType = this.data.jiaoyiType;
        this.fullcount = '--';
        this.maxPrice = 10;
        this.minPrice = 5;
        this.appointCnt = null;
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
        this.http.commission().subscribe(res => {
            this.ygsxf = parseFloat(res.toString());
        });
        this.ableScale = this.data.getSession('backscale');
    }

    ngDoCheck() {
        this.jiaoyiType = this.data.jiaoyiType;
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
        if (this.data.searchStockCode !== '' && this.data.searchStockCode.length === 8 && this.data.searchStockCode !== this.stockCode) {
            this.stockCode = this.data.searchStockCode;
            this.getGPHQ();
        }
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.data.resetStockHQ();
        this.cancelSubscribe();
        this.data.searchStockCode = '';
    }

    ableCnt() {
        // tslint:disable-next-line:max-line-length
        if (this.classType === 'BUY' && !this.data.isNull(this.appointPrice)
            && !this.data.isNull(this.appointCnt)) {
            this.maxAppointCnt = (this.ableScale / (10000 * parseFloat(this.appointPrice) + this.commission)).toString();
            this.maxAppointCnt = parseInt(this.maxAppointCnt, 0).toString();
        }
        return this.maxAppointCnt;
    }



    /**
     * 选择价格类型
     */
    selectType(type) {
        this.priceType = type;
        switch (type) {
            case 1:
                // tslint:disable-next-line:max-line-length
                this.appointPrice = this.classType === 'BUY' ? this.data.stockHQ.sellLevel.sellPrice05 : this.data.stockHQ.buyLevel.buyPrice05;
                break;
            case 2:
                if (this.classType === 'BUY') {
                    this.appointPrice = this.data.roundNum(this.data.stockHQ.sellLevel.sellPrice01, 4);
                } else {
                    this.appointPrice = this.data.roundNum(this.data.stockHQ.buyLevel.buyPrice01, 4);
                }
                break;
            case 3:
                if (this.classType === 'BUY') {
                    this.appointPrice = this.data.roundNum(this.data.stockHQ.buyLevel.buyPrice01, 4);
                } else {
                    this.appointPrice = this.data.roundNum(this.data.stockHQ.sellLevel.sellPrice01, 4);
                }
                break;
            default:
                break;
        }
        this.appointPrice = this.data.roundNum(this.appointPrice, 4);
    }

    /**
     * 获取股票列表
     */
    getQuotation() {
        this.data.searchStockCode = '';
        this.stockHQ.lastPrice = '';
        this.stockHQ.upRatio = '';
        this.stockName = '';
        this.show = 'active';
        const content = null;
        this.cancelSubscribe();
        this.http.searchStock(this.data.jiaoyiType === 'BUY' ? this.stockCode : this.stockCode + '&seller=true').subscribe((res) => {
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
        } else if (this.appointCnt !== this.appointCnt) {
            this.data.ErrorMsg(this.text + '数量必须是整数');
        } else if (this.appointCnt > this.fullcount && this.classType === 'SELL') {
            this.data.ErrorMsg(`${this.text}数量必须小于可${this.text2}数量`);
        } else if (this.appointCnt <= 0) {
            this.data.ErrorMsg(this.text + '数量必须大于0');
        } else if (this.appointCnt > 200) {
            this.data.ErrorMsg(this.text + '数量不能大于200张');
        } else {
            if (this.data.jiaoyiType === 'SELL' && this.classType === 'BUY') { // 卖方买入获取释放保证金
                this.getBaozhengjin();
            } else {
                this.submitAlert = this.data.show;
            }

        }

    }

    /**
     * 买入确认
     */
    submintBuy() {
        this.data.Loading(this.data.show);
        let content = {
            'stockCode': this.stockCode,
            'appointCnt': this.appointCnt,
            'appointPrice': this.appointPrice
        };
        /**
         * 买方买入 BUY OPEN
         * 买方卖出 SELL CLOSE
         * 卖方卖出 SELL OPEN
         * 卖方买入 BUY CLOSE
         */
        let classType = 'BUY';
        let openType = 'CLOSE';
        if (this.classType === 'BUY' && this.jiaoyiType === 'BUY') { // 买方买入
            classType = 'BUY';
            openType = 'OPEN';
        } else if (this.classType === 'SELL' && this.jiaoyiType === 'BUY') { // 买方卖出
            classType = 'SELL';
            openType = 'CLOSE';
        } else if (this.classType === 'SELL' && this.jiaoyiType === 'SELL') { // 卖方卖出
            classType = 'SELL';
            openType = 'OPEN';
            content = Object.assign(content, { lever: this.gearing });
        } else if (this.classType === 'BUY' && this.jiaoyiType === 'SELL') { // 卖方买入
            classType = 'BUY';
            openType = 'CLOSE';
        }


        this.http.order(classType, content, openType).subscribe((res: Response) => {
            if (res['success']) {
                this.data.ErrorMsg('已委托，待成交');
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
        this.appointCnt = null;
        this.ccount = '';
        this.stockName = '';
        this.fullcount = '--';
        this.priceType = 0;
        this.data.resetStockHQ();
        this.data.searchStockCode = '';
        this.stockHQ = this.data.stockHQ;
        this.cancelSubscribe();
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
        if (this.data.jiaoyiType === 'SELL' && this.classType === 'SELL') { // 卖方卖出获取保证金
            this.getBaozhengjin();
        }
    }

    /**
     * 获取保证金
     */
    getBaozhengjin() {
        const code = this.classType === 'SELL' ? `OPEN/${this.stockCode}` : `CLOSE/${this.stockCode}?closeCnt=${this.appointCnt}`;
        this.http.getBaozhengjin(code).subscribe(res => {
            this.baozhengjin = res['resultInfo'];
            if (this.classType === 'BUY') {
                this.submitAlert = this.data.show;
            }
        }, err => {
            this.data.error = err.error;
            this.data.isError();
        });
    }

    // 选中合约
    getGPHQ() {
        this.priceType = 1;
        this.ccount = '';
        this.show = 'inactive';
        this.http.getGPHQ2(this.stockCode, this.data.token, this.data.jiaoyiType === 'SELL' ? 'true' : 'false').subscribe((res) => {
            console.log('订阅成功');
            if (!this.data.isNull(res['resultInfo']['quotation'])) {
                this.data.stockHQ = res['resultInfo']['quotation'];
                if (this.classType === 'BUY') {
                    this.fullcount = res['resultInfo']['maxBuyCnt'];
                    this.appointCnt = this.fullcount >= 10 ? 10 : this.fullcount;
                    this.appointPrice = this.data.roundNum(this.data.stockHQ.sellLevel.sellPrice05, 4);
                } else {
                    this.fullcount = res['resultInfo']['maxSellCnt'];
                    if (this.fullcount > 200) {
                        this.appointCnt = 200;
                    } else {
                        this.appointCnt = this.fullcount;
                    }
                    this.appointPrice = this.data.roundNum(this.data.stockHQ.buyLevel.buyPrice05, 4);
                }
                this.stockName = this.data.stockHQ.stockName;
            } else {
                this.stockHQ = this.data.stockHQ;
            }

        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }

    gearingType(type) {
        this.gearing = type;
        this.http.maxSellCnt(this.stockCode, this.gearing).subscribe(res => {
            this.fullcount = res['resultInfo'];
            this.appointCnt = this.fullcount;
        });
    }

    totalBZJ() {
        return this.data.roundNumber(this.baozhengjin * this.appointCnt / this.gearing);
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
