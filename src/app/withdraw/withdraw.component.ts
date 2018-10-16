import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

  back() {
    window.history.back();
  }

  goto(url) {
    this.data.goto(url);
  }
}
