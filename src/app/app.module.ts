import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsercenterComponent } from './usercenter/usercenter.component';
import { DataService } from './data.service';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { JiaoyiComponent } from './jiaoyi/jiaoyi.component';
import { ZixuanComponent } from './zixuan/zixuan.component';
import { BuyComponent } from './buy/buy.component';
import { ChedanComponent } from './chedan/chedan.component';
import { ChicangComponent } from './chicang/chicang.component';
import { SearchComponent } from './search/search.component';
import { CclbComponent } from './cclb/cclb.component';
import { SsgpComponent } from './ssgp/ssgp.component';
import { HttpService } from './http.service';
import { AlertComponent } from './alert/alert.component';
import { LoadingComponent } from './loading/loading.component';
import { NumIntPipe } from './num-int.pipe';
import { ToFixedPipe } from './to-fixed.pipe';
import { Round4Pipe } from './round4.pipe';
import { ChartComponent } from './chart/chart.component';
import { RechargeComponent } from './recharge/recharge.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { CardComponent } from './card/card.component';
import { TransferComponent } from './transfer/transfer.component';
import { BankcardComponent } from './bankcard/bankcard.component';
import { IndexComponent } from './index/index.component';
import { QuotalistComponent } from './quotalist/quotalist.component';
import { SignupComponent } from './signup/signup.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { CapitalFlowComponent } from './capital-flow/capital-flow.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { VersionComponent } from './page/version/version.component';
import { NotfoundComponent } from './page/notfound/notfound.component';
import { DetailComponent } from './detail/detail.component';
import { HtmlpipePipe } from './htmlpipe.pipe';
import { InquireComponent } from './inquire/inquire/inquire.component';
import { SettingComponent } from './setting/setting/setting.component';
import { ResetPwdComponent } from './setting/reset-pwd/reset-pwd.component';
import { MemberComponent } from './inquire/member/member.component';
import { Qrcode2Component } from './inquire/qrcode2/qrcode2.component';

const jiaoyiChildRoutes: Routes = [
  { path: 'chicang', component: ChicangComponent },
  { path: 'chedan', component: ChedanComponent },
  { path: 'search', component: SearchComponent },
  { path: 'sell', component: BuyComponent },
  { path: 'buy', component: BuyComponent },
  { path: '', redirectTo: 'buy', pathMatch: 'full' }
];

const appChildRoutes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'chicang', component: ChicangComponent },
  { path: 'usercenter', component: UsercenterComponent },
  { path: 'ssgp', component: SsgpComponent },
  { path: 'zixuan', component: ZixuanComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forget', component: SignupComponent },
  { path: 'jiaoyi', component: JiaoyiComponent, children: jiaoyiChildRoutes },
  { path: '', redirectTo: 'index', pathMatch: 'full' }
];

const appRoutes: Routes = [
  { path: 'qrcode2', component: Qrcode2Component },
  { path: 'member', component: MemberComponent },
  { path: 'resetPwd', component: ResetPwdComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'inquire', component: InquireComponent },
  { path: 'version', component: VersionComponent },
  { path: 'qrcode/:id', component: QrcodeComponent },
  { path: 'capitalflow', component: CapitalFlowComponent },
  { path: 'quatolist/:id', component: QuotalistComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'bankcard', component: BankcardComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'recharge', component: RechargeComponent },
  { path: 'card', component: CardComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'usercenter', component: UsercenterComponent },
  { path: 'main', component: MainComponent, children: appChildRoutes },
  { path: 'newdetail/:id', component: NewsDetailComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsercenterComponent,
    MainComponent,
    FooterComponent,
    JiaoyiComponent,
    ZixuanComponent,
    BuyComponent,
    ChedanComponent,
    ChicangComponent,
    SearchComponent,
    CclbComponent,
    SsgpComponent,
    AlertComponent,
    LoadingComponent,
    NumIntPipe,
    ToFixedPipe,
    Round4Pipe,
    ChartComponent,
    RechargeComponent,
    WithdrawComponent,
    CardComponent,
    TransferComponent,
    BankcardComponent,
    IndexComponent,
    QuotalistComponent,
    SignupComponent,
    NewsDetailComponent,
    CapitalFlowComponent,
    QrcodeComponent,
    VersionComponent,
    NotfoundComponent,
    DetailComponent,
    HtmlpipePipe,
    InquireComponent,
    SettingComponent,
    ResetPwdComponent,
    MemberComponent,
    Qrcode2Component
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ClipboardModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true }),
  ],
  providers: [DataService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
