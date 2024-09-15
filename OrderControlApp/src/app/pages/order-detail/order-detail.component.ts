import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderTrackingNo: string | null = null;
  order: Order | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderTrackingNo = params.get('orderTrackingNo');
      if (this.orderTrackingNo) {
        this.loadOrderDetails(this.orderTrackingNo);
      }
    });
  }

  private loadOrderDetails(orderTrackingNo: string): void {
    this.ordersService.getOrdersByOrderTrackingNo(orderTrackingNo)
      .subscribe({
        next: (orders: Order[]) => {
          this.order = orders.length > 0 ? orders[0] : null;
        },
        error: (err) => {
          console.error('Error fetching order details:', err);
        }
      });
  }
}
