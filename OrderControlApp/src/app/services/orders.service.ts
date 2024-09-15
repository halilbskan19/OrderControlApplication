import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderCount } from '../models/header-count.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private headerCountApiUrl = 'http://localhost:3000/header'; // JSON Server Header API URL
  private dataTableApiUrl = 'http://localhost:3000/dataTable'; // JSON Server Data Table API URL

  constructor(private http: HttpClient) { }

  getHeaderCount(): Observable<HeaderCount> {
    return this.http.get<HeaderCount>(this.headerCountApiUrl);
  }

  // Tüm siparişleri getirir
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.dataTableApiUrl);
  }

  // Filtreleme yapmak için
  getOrdersByOrderTrackingNo(orderTrackingNo: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.dataTableApiUrl}?orderTrackingNo=${orderTrackingNo}`);
  }
}
