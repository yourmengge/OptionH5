import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements DoCheck {

  public url: string;
  public menuList: any;
  public name: string;

  constructor(public data: DataService) { }

  ngDoCheck() {
    this.url = this.data.getUrl(2);
    if (this.url === 'ssgp') {
      this.url = 'zixuan';
    }
    this.menuList = this.data.getFooterMenu();
    this.title();
    if (this.data.getUrl(2) !== 'jiaoyi') {
      this.data.nowUrl = '';
     // this.data.clearInterval();
    }
  }




  goto(url) {
    this.url = url;
    this.data.goto('main/' + url);
    this.title();
  }

  title() {
    for (const i in this.menuList) {
      if (this.menuList[i]['id'] === this.url) {
        this.name = this.menuList[i]['title'];
      }
    }
  }

}
