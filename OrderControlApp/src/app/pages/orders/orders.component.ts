import { Component, OnInit } from '@angular/core';
import { HeaderCount } from 'src/app/models/header-count.model';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
	headerData: HeaderCount | undefined;
	ordersData: Order[] = [];
	pagedOrders: Order[] = [];
	progress: number = 30;
	itemsPerPage: number = 5; // Varsayılan gösterim sayısı
	currentPage: number = 1; // Varsayılan sayfa numarası
	totalPagesArray: number[] = [];
	itemsPerPageOptions: number[] = [5, 10, 20];

	constructor(private ordersService: OrdersService, private router: Router) { }

	ngOnInit() {
		this.loadData();
	}

	loadData() {
		this.ordersService.getHeaderCount().pipe(
			switchMap(headerData => {
				this.headerData = headerData;

				try {
					const completedOrder = this.headerData.completedOrder || "0/0";
					const [totalValue, currentValue] = completedOrder.split("/").map(Number);
					this.progress = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
				} catch (error) {
					console.error('Hata oluştu:', error);
					this.progress = 0;
				}

				return this.ordersService.getOrders();
			})
		).subscribe({
			next: (ordersData: Order[]) => { // Düzeltilmiş tip
				this.ordersData = ordersData;
				this.updatePagedOrders();
				this.calculateTotalPages();
			},
			error: (error) => {
				console.error('API çağrısında hata oluştu:', error);
				this.progress = 0;
			}
		});
	}

	getOrderDetail(orderTrackingNo: string) {
		this.ordersService.getOrdersByOrderTrackingNo(orderTrackingNo).subscribe((data: Order[]) => {
			this.ordersData = data;
		});
	}


	navigateToOrderDetails(orderTrackingNo: string) {
		this.router.navigate(['/detail', orderTrackingNo]);
	}

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = ('0' + date.getDate()).slice(-2);
		const month = ('0' + (date.getMonth() + 1)).slice(-2);
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	onItemsPerPageChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.itemsPerPage = +select.value;
		this.currentPage = 1; // Sayfa numarasını sıfırla
		this.updatePagedOrders();
		this.calculateTotalPages();
	}

	onPageChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.currentPage = +select.value;
		this.updatePagedOrders();
	}

	updatePagedOrders() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		this.pagedOrders = this.ordersData.slice(startIndex, endIndex);
	}

	calculateTotalPages() {
		const totalPages = Math.ceil(this.ordersData.length / this.itemsPerPage);
		this.totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
	}
}
