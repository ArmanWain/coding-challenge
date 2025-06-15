import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Sale } from '../../services/sales-data.service';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  @Input() sales: Sale[] = [];

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
    },
    elements: {
      bar: {
        borderWidth: 0,
        borderSkipped: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
        title: {
          display: false,
        },
      },
    },
  };

  ngOnChanges(): void {
    const grouped = this.sales.reduce<Record<string, number>>((acc, sale) => {
      const channel = sale.channel.toLowerCase();
      acc[channel] = (acc[channel] || 0) + sale.amount;
      return acc;
    }, {});

    this.chartData = {
      labels: Object.keys(grouped).map((label) => this.capitalize(label)),
      datasets: [
        {
          label: 'Sales by Channel',
          data: Object.values(grouped),
          backgroundColor: ['#42A5F5', '#66BB6A'],
          hoverBorderColor: '#FFFFFF',
        },
      ],
    };
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
