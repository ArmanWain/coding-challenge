import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Sale } from '../../services/sales-data.service';

@Component({
  standalone: true,
  selector: 'app-pie-chart',
  imports: [CommonModule, NgChartsModule],
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent implements OnChanges {
  @Input() sales: Sale[] = [];

  chartData!: ChartData<'pie'>;
  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  ngOnChanges(): void {
    const loyaltySales = this.sales.filter((s) => s.isLoyaltyCustomer);
    const allAverage = this.sales.length
      ? this.total(this.sales) / this.sales.length
      : 0;
    const loyaltyAverage = loyaltySales.length
      ? this.total(loyaltySales) / loyaltySales.length
      : 0;

    this.chartData = {
      labels: ['All Customers', 'Loyalty Customers'],
      datasets: [
        {
          data: [allAverage, loyaltyAverage],
        },
      ],
    };
  }

  private total(sales: Sale[]): number {
    return sales.reduce((sum, s) => sum + s.amount, 0);
  }
}
