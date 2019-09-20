import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable()
export class HttpService {
  stompClient: any;
  public host = '';
  // public host = 'http://101.132.65.124:10008/option/';
  public ws = '';
  public stockHQ: any;

  constructor(public http: HttpClient, public data: DataService) {
    console.log(location.protocol);
    this.host = 'http://192.168.1.82/option/';
    // this.host = 'https://opt.anandakeji.com/option/';
    this.ws = this.host + 'webSocket';
  }

  POST(url, data) {
    this.data.getHeader();
    return this.http.post(url, data, this.data.getHeader());
  }

  /**
   * 获取验证码
   */
  getCode(type, phone) {
    return this.http.post(this.host + `public/smsCode/${type}/${phone}`, {});
  }

  /**
   * 资金流水
   */
  getFlow(data) {
    return this.POST(this.host + 'tntg/fundStream/list', data);
  }

  /**
   * 用户注册
   */
  signup(data) {
    return this.http.post(this.host + `public/register`, data);
  }

  /**
 * 用户忘记密码
 */
  reset(data) {
    return this.http.post(this.host + `public/pwdResetByVerifyCode`, data);
  }

  /**
   * 用户修改密码
   */
  resetOldPwd(data) {
    return this.POST(this.host + 'tntg/pwdReset', data);
  }

  /**
   * 资讯列表
   */
  newsList() {
    return this.http.post(this.host + 'tn/quota/newsList', {});
  }

  /**
   * 资讯详情
   */
  newsDetail(id) {
    return this.http.post(this.host + `tn/quota/newsDetail/${id}`, {});
  }

  /**
   * 获取银行列表
   */
  getBankList() {
    return this.POST(this.host + 'tn/banks', {});
  }

  /**
   * 银行转账信息提交
   * @param amount 充值金额
   */
  submitBankTrans(amount, type) {
    return this.POST(this.host + 'tntg/submitBankTrans/' + type, { totalAmount: amount });
  }

  /**
   * 获取银行省份列表
   */
  getProvinceList(bankId) {
    return this.POST(this.host + `tn/banks/${bankId}/provinces`, {});
  }

  /**
 * 获取银行城市列表
 */
  getCityList(bankId, provinceId) {
    return this.POST(this.host + `tn/banks/${bankId}/province/${provinceId}/cities`, {});
  }

  /**
  * 获取银行支行列表
  */
  getBranchList(bankId, provinceId, branchId) {
    return this.POST(this.host + `tn/banks/${bankId}/province/${provinceId}/cities/${branchId}/branches`, {});
  }

  /**
   * 查询银行卡绑定
   */
  getCard() {
    return this.POST(this.host + `tn/query/card`, {});
  }

  /**
  * 查询指定银行卡绑定
  */
  getCard2(cardId) {
    return this.POST(this.host + `tn/query/card/${cardId}`, {});
  }


  /**
   * 绑定银行卡
   * @param data 绑定银行卡
   */
  bandCard(data) {
    return this.POST(this.host + `tn/bind/card`, data);
  }

  /**
   * 充值
   */
  aliPay(moeny) {
    return this.http.post(this.host + `alipay/sign?totalAmount=${moeny}`, {},
      { headers: this.data.getPayHeader(), responseType: 'text' });
  }

    /**
   * 获取证券静态数据
   */
  getSecurities(code) {
    return this.POST(this.host + `tn/quota/oneTrend/${code}`, '');
  }

  /**
   * 获取充值配置
   */
  getCardConfig() {
    return this.POST(this.host + 'tntg/config/CTRL_PAY_CHANNEL', {});
  }

  /**
   * 第三方支付 微信：thirdpay ，支付宝：thirdpayBCAT ，汇宝微信：thirdpayHBWX
   */
  thirdPay(type, data) {
    return this.http.post(`${this.host}${type}/request`, data,
      { headers: { 'Authorization': this.data.getToken() }, responseType: 'text' });
  }

  // thirdPayBCAT(data) {
  //   return this.http.post(this.host + 'thirdpayBCAT/request', data,
  //     { headers: { 'Authorization': this.data.getToken() }, responseType: 'text' });
  // }

  /**
   * 合约周期
   */
  heyuezhouqi() {
    return this.http.post(this.host + `tn/quota/yymm`, {});
  }

  /**
   * 获取认购/认沽列表
   * @param date 日期
   * @param type 买或卖
   */
  getQuotaList(date, type) {
    return this.http.post(this.host + `tn/quota/yymm/${date}/${type}`, {});
  }

  /**
   * 总体趋势
   */
  generalTrend() {
    return this.http.post(this.host + `tn/quota/generalTrend`, {});
  }

  /**
   * 分时图数组
   */
  fenshituList(optionCode) {
    return this.POST(this.host + `tn/quota/detail/${optionCode}`, {});
  }

  /**
   * 合约列表
   * @Param date
   */
  heyueList(date) {
    return this.http.post(this.host + `tn/quota/yymm/${date}`, {});
  }

  /**
 * 请求股票行情
 */
  getGPHQ(code) {
    return this.http.post(this.host + `push/subsMarket/${code}?tokenP=${this.data.getTokenP()}`, {});
  }

  /**
  * 请求股票行情
  */
  getGPHQ2(code, type) {
    return this.POST(this.host + `push/subsMarket/${code}?tokenP=${this.data.getTokenP()}`, {});
  }


  /**
 * 获取手续费
 */
  commission() {
    return this.POST(this.host + 'tntg/commission', {});
  }

  /**
   * 获取收款人信息
   */
  getPayCardInfo() {
    return this.POST(this.host + 'tntg/payCardInfo', {});
  }

  /**
   *  静态信息
   * @param code 合约代码
   */
  getStatic(code) {
    return this.POST(this.host + `tn/quota/static/${code}`, {});
  }
  /**
   * 登录接口
   */
  login(data) {
    return this.http.post(this.host + 'tntg/login', data);
  }

  /**
   * 模糊查询股票
   */
  searchStock(code) {
    return this.POST(this.host + 'tntg/stock?input=' + code, {});
  }

  /**
   * 提现
   */
  withdraw(data) {
    return this.POST(this.host + 'tntg/lift', data);
  }

  /**
   * 下单 参数 买入：BUY 卖出：SELL
   */
  order(type, data, stockType) {
    return this.POST(this.host + 'tntg/appoint/' + type + '/' + stockType, data);
  }

  /**
   * 取消订阅
   */
  cancelSubscribe() {
    return this.http.post(`${this.host}push/unsubsMarket?tokenP=${this.data.getTokenP()}`, {});
  }

  /**
   * 查询持仓
   */
  getHold() {
    return this.POST(this.host + 'tntg/hold', {});
  }

  /**
   * 查询委托
   */
  getAppoint(time) {
    return this.POST(this.host + 'tntg/appointHis?' + time, {});
  }

  /**
   * 个人中心
   */
  userCenter() {
    return this.POST(this.host + 'tntg/capital', {});
  }

  /**
   * 确认撤单
   */
  chedan(data) {
    return this.POST(this.host + 'tntg/batchCancel', data);
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

  /**
   * 分笔持仓
   */
  holdDetail() {
    return this.POST(this.host + 'tntg/holdDetail', {});
  }

  /**
   * 平仓
   */
  appointSELL(stockCode, type, pkOrder = '') {
    return this.POST(`${this.host}tntg/appoint/${type}/CLOSE/${stockCode}?pkOrder=${pkOrder}`, {});
  }

  /**
   * 获取推广码
   */
  getInviteCode() {
    return this.POST(this.host + 'tntg/inviteCode', {});
  }

  /**
   * 历史委托，历史成交，分页查询
   */
  getHisAppoint(url, data) {
    return this.POST(this.host + `tn/history/${url}`, data);
  }

  /**
   * 历史委托详情，历史成交详情
   */
  getAppointDetail(url) {
    return this.POST(this.host + `tn/history/${url}`, {});
  }

  /**
   * 获取会员列表
   */
  getMember(data) {
    return this.POST(this.host + 'tntg/members', data);
  }

  /**
   * 获取充值提现限制
   */
  chargeWithdrawInfo() {
    return this.POST(this.host + 'tntg/chargeWithdrawInfo', {});
  }

  /**
   * 结算接口
   */
  settleMent(type, data) {
    return this.POST(`${this.host}tn/history/${type}`, data);
  }

  /**
   * 提现手续费
   */
  transferCommission() {
    return this.POST(`${this.host}tntg/config/CTRL_WITHDRAW_COMMISSION`, {});
  }

  /**
   * 支付接口 汇聚：thirdpayJoinpay 商银信：thirdpayAllscoreQuick
   */
  payment(data, type) {
    return this.POST(`${this.host}${type}/smsCode`, data);
  }

  /**
    * 短信确认接口 汇聚：thirdpayJoinpay 商银信：thirdpayAllscoreQuick
    */
  smsCode(code, type) {
    return this.POST(`${this.host}${type}/pay/${code}`, {});
  }

  /**
   * 支付接口标准快捷支付
   */
  payment2(url, data) {
    return this.http.post(`${this.host}${url}`, data, { headers: { 'Authorization': this.data.getToken() }, responseType: 'text' });
  }

  /**
   * 获取银行列表
   */
  getBankList2(type) {
    return this.POST(`${this.host}tntg/config/${type}`, {});
  }

  /**
   * 删除绑定银行卡
   */
  delCard(cardId) {
    return this.POST(`${this.host}tn/delete/card/${cardId}`, {});
  }

  /**
   * 获取银行卡列表
   */
  getCardList() {
    return this.POST(`${this.host}tn/query/card/list`, {});
  }

  /**
   * 银行卡设为默认
   */
  defaultCard(id) {
    return this.POST(`${this.host}tn/default/card/${id}`, {});
  }

  /**
   * 获取充值金额
   */
  getRechargeMoney() {
    return this.POST(`${this.host}tntg/config/PAY_CHARGE_ITEM`, {});
  }

    /**
   * 获取充值金额
   */
  getCertifyFlag() {
    return this.POST(`${this.host}tntg/config/CERTIFY_FLAG`, {});
  }


  /**
   * 实名认证
   */
  auth(data) {
    return this.POST(`${this.host}tntg/bankCheck4`, data);
  }


  /**
   * 查询实名信息
   */
  getAuth() {
    return this.POST(`${this.host}tntg/certifyInfo`, '');
  }


}
