import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
    setTimeout(() => {
      this.data.goto('main');
    }, 2000);
  }

}
