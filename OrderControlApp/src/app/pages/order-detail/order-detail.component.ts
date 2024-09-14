import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
    orderTrackingNo: string | null = null;

    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.orderTrackingNo = params.get('orderTrackingNo');
        console.log('Sipariş No:', this.orderTrackingNo);
      });
    }
}
