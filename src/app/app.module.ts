import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

const jiaoyiChildRoutes: Routes = [
  { path: 'chicang', component: ChicangComponent },
  { path: 'chedan', component: ChedanComponent },
  { path: 'search', component: SearchComponent },
  { path: 'sell', component: BuyComponent },
  { path: 'buy', component: BuyComponent },
  { path: '', redirectTo: 'buy', pathMatch: 'full' }
];

const appChildRoutes: Routes = [
  { path: 'usercenter', component: UsercenterComponent },
  { path: 'ssgp', component: SsgpComponent },
  { path: 'zixuan', component: ZixuanComponent },
  { path: 'jiaoyi', component: JiaoyiComponent, children: jiaoyiChildRoutes },
  { path: '', redirectTo: 'usercenter', pathMatch: 'full' }
];

const appRoutes: Routes = [
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'recharge', component: RechargeComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'usercenter', component: UsercenterComponent },
  { path: 'main', component: MainComponent, children: appChildRoutes },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
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
    WithdrawComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true }),
  ],
  providers: [DataService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
