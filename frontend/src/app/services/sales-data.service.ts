import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sale {
  date: string;
  amount: number;
  isLoyaltyCustomer: boolean;
  channel: string;
}

@Injectable({ providedIn: 'root' })
export class SalesDataService {
  private baseUrl = 'http://localhost:5137/api/chart/summary';

  constructor(private http: HttpClient) {}

  getSalesData(params: { period?: string; startDate?: string; endDate?: string }): Observable<{ sales: Sale[] }> {
    let httpParams = new HttpParams();
    if (params.period) httpParams = httpParams.set('period', params.period);
    if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);

    return this.http.get<{ sales: Sale[] }>(this.baseUrl, { params: httpParams });
  }
}
