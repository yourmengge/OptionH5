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
  pageNo = 1;
  stopLoad = false;
  accountCode = '';
  constructor(public data: DataService, public http: HttpService) { }

  ngOnInit() {
    this.getMembers();
  }

  onScroll(e) {
    if (Math.round(e.srcElement.scrollTop + e.srcElement.clientHeight) >= e.srcElement.scrollHeight) {
      if (!this.stopLoad) {
        this.pageNo = this.pageNo + 1;
        this.getMembers();
      }
    }
  }

  search() {
    this.list = [];
    this.getMembers();
  }

  getMembers() {
    const data = {
      accountCode: this.accountCode,
      pageNo: this.pageNo,
      pageSize: 20,
    };
    this.http.getMember(data).subscribe((res: Array<any>) => {
      if (res.length === 0) {
        this.stopLoad = true;
      } else {
        this.stopLoad = false;
      }
      this.list = this.list.concat(res);
    });
  }
  back() {
    this.data.back();
  }
}
