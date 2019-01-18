import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-hold-detail',
  templateUrl: './hold-detail.component.html',
  styleUrls: ['./hold-detail.component.css']
})
export class HoldDetailComponent implements OnInit {
  detail: any;
  constructor(public data: DataService) { }

  ngOnInit() {
    this.detail = JSON.parse(this.data.getSession('holdDetail'));
  }

  back() {
    this.data.back();
  }

}
