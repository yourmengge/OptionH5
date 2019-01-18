import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-appoint-detail',
  templateUrl: './appoint-detail.component.html',
  styleUrls: ['./appoint-detail.component.css']
})
export class AppointDetailComponent implements OnInit {
  detail: any;
  text = '';
  constructor(public data: DataService, public http: HttpService) {
    this.text = this.data.getSession('appointType');
  }

  ngOnInit() {
    this.getAppointDetail();
  }

  back() {
    this.data.back();
  }

  getAppointDetail() {
    const url = this.data.getSession('appointUrl');
    this.http.getAppointDetail(url).subscribe(res => {
      this.detail = res;
    });
  }

}
