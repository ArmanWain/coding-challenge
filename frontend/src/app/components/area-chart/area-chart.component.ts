import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { Sale } from '../../services/sales-data.service';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule, CurrencyPipe],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.css',
})
export class AreaChartComponent implements OnChanges {
  @Input() sales: Sale[] = [];

  chartData: ChartData<'line'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.raw as number;
            return `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
        title: {
          display: false,
          text: 'Sales ($)',
        },
      },
    },
  };

  totals = { allCustomers: 0, loyaltyCustomers: 0 };

  ngOnChanges() {
    if (!this.sales || this.sales.length === 0) return;

    const grouped = this.sales.reduce((acc: any, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!acc[date]) acc[date] = { total: 0, loyaltyTotal: 0 };
      acc[date].total += sale.amount;
      if (sale.isLoyaltyCustomer) acc[date].loyaltyTotal += sale.amount;
      return acc;
    }, {});

    this.chartData = {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'All Customers',
          data: Object.values(grouped).map((s: any) => s.total),
          fill: true,
        },
        {
          label: 'Loyalty Customers',
          data: Object.values(grouped).map((s: any) => s.loyaltyTotal),
          fill: true,
        },
      ],
    };

    this.totals.allCustomers = this.sales.reduce((sum, s) => sum + s.amount, 0);
    this.totals.loyaltyCustomers = this.sales
      .filter((s) => s.isLoyaltyCustomer)
      .reduce((sum, s) => sum + s.amount, 0);
  }
}
