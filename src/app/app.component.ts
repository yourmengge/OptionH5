import { Component, DoCheck } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  alert = true;
  title = 'app';
  loading = true;

  constructor(public data: DataService) {
    this.alert = this.data.alert;
    this.loading = this.data.loading;
  }

  ngDoCheck() {
    this.alert = this.data.alert;
    this.loading = this.data.loading;
  }
}
