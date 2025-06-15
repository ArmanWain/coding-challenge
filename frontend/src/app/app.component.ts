import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SalesDataService, Sale } from './services/sales-data.service';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AreaChartComponent,
    BarChartComponent,
    PieChartComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  sales: Sale[] = [];
  selectedRange: string = 'lastMonth';
  startDate: string = '';
  endDate: string = '';

  constructor(private salesService: SalesDataService) {}

  ngOnInit() {
    this.loadSalesData();
  }

  onRangeChange() {
    this.loadSalesData();
  }

  private loadSalesData() {
    const params: any = {};
    if (this.selectedRange === 'custom') {
      if (this.startDate) params.startDate = this.startDate;
      if (this.endDate) params.endDate = this.endDate;
    } else {
      params.period = this.selectedRange;
    }

    this.salesService.getSalesData(params).subscribe(response => {
      this.sales = response.sales;
    });
  }
}
