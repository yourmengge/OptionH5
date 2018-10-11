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
      width: document.body.clientWidth,
      height: 180,
      prices: [9.8, 9.79, 9.76, 9.92, 10.14, 10.2, 10.1],
      volumes: [415200, 1616900, 753646, 717437],
      avgPrices: [9.8, 9.79, 9.76, 9.92, 10.14, 10.2, 10.1],
      preClosePrice: 9.66
    });

  }

}
