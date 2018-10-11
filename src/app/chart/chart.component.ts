import { Component, OnInit } from '@angular/core';
declare var StockChart: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    StockChart.drawTrendLine({
      id: 'trendLine',
      height: 180,
      width: document.body.clientWidth - 20,
      prices: [0.046, 0.076, 0.066, 0.086, 0.166, 0.166, 0.266, 0.046, 0.076, 0.066, 0.086, 0.166, 0.166, 0.266],
      volumes: [4100, 6900, 646, 737, 4100, 6900, 646, 737, 4100, 6900, 646, 737],
      volumeHeight: 50,
      preClosePrice: 0.066
    });

  }

}
