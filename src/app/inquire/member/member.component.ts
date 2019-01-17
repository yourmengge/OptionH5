import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  list = [{
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }, {
    name: '张萌立',
    phone: '13344405940',
    desc: '配资'
  }];
  constructor(public data: DataService) { }

  ngOnInit() {
  }
  back() {
    this.data.back();
  }
}
