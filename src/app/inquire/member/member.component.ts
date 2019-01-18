import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  list = [];
  constructor(public data: DataService, public http: HttpService) { }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    this.http.getMember().subscribe(res => {
      this.list = this.list.concat(res);
    });
  }
  back() {
    this.data.back();
  }
}
