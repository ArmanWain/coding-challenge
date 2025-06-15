import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import {
  Chart,
  LineController,
  BarController,
  PieController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(
  LineController,
  BarController,
  PieController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  zoomPlugin
);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
