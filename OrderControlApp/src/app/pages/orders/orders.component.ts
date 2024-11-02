import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { HeaderCount } from 'src/app/models/header-count.model';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { DistributionStatus, Status } from 'src/app/models/enums/status.enum';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  // Header bilgilerini tutan değişken
  headerData: HeaderCount | undefined;

  // Sipariş verilerini tutan değişkenler
  ordersData: Order[] = [];
  pagedOrders: Order[] = [];
  allOrdersData: Order[] = [];

  // Yükleme ilerlemesini göstermek için değişken
  progress: number = 30;

  // Sayfalama ile ilgili değişkenler
  itemsPerPage: number = 5; // Varsayılan gösterim sayısı
  currentPage: number = 1; // Varsayılan sayfa numarası
  totalPagesArray: number[] = [];
  itemsPerPageOptions: number[] = [5, 10, 20]; // Sayfa başına öğe seçenekleri

  loadingBarCurrentValue: number = 0;
  loadingBarTotalValue: number = 0;

  // Filtreleme ile ilgili değişkenler
  filter: {
    orderTrackingNo: string;
    shipmentTrackingNo: string;
    plate: string;
    startDate: Date | null;
    endDate: Date | null;
    status: Status | null;
    distributionStatus: DistributionStatus | null;
  } = {
      orderTrackingNo: '',
      shipmentTrackingNo: '',
      plate: '',
      startDate: null,
      endDate: null,
      status: null,
      distributionStatus: null
    };

  // Tarih aralığı formu
  dateRangeFormGroup: FormGroup;

  // Durum seçenekleri (enum'lara dayalı)
  statusOptions = [
    { value: Status.Created, label: 'Oluşturuldu' },
    { value: Status.Cancelled, label: 'İptal Edildi' },
    { value: Status.Delivered, label: 'Teslim Edildi' },
    { value: Status.Pending, label: 'Bekliyor' },
    { value: Status.Undelivered, label: 'Teslim Edilemedi' }
  ];

  // Dağıtım durumu seçenekleri (enum'lara dayalı)
  distributionStatusOptions = [
    { value: DistributionStatus.Yes, label: 'Evet' },
    { value: DistributionStatus.No, label: 'Hayır' }
  ];

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    // Formu oluşturur ve tarih formatını Türkçe yapar
    this.dateRangeFormGroup = this.fb.group({
      start: [null],
      end: [null]
    });
    this.dateAdapter.setLocale('tr'); // Türkçe tarih formatı
  }

  ngOnInit(): void {
    this.loadData(); // Verileri yükler
  }

  private loadData(): void {
    // Header bilgilerini ve sipariş verilerini yükler
    this.ordersService.getHeaderCount().pipe(
      switchMap(headerData => {
        this.headerData = headerData;
        this.updateProgress(); // Yükleme ilerlemesini günceller
        return this.ordersService.getOrders();
      })
    ).subscribe({
      next: ordersData => {
        this.ordersData = ordersData;

        this.allOrdersData = [...ordersData]; // Tüm verilerin yedeğini tutar
        this.updatePagedOrders(); // Sayfalandırılmış verileri günceller
        this.calculateTotalPages(); // Toplam sayfa sayısını hesaplar
      },
      error: err => {
        console.error('API çağrısında hata oluştu:', err);
        this.progress = 0; // Hata durumunda ilerlemeyi sıfırlar
      }
    });
  }

  updateOrderStatu(data: string) {
    const statusText = this.statusOptions
      .filter(option => option.value === data) // Gelen data ile eşleşen statü kodunu bul
      .map(option => {
        // Eşleşen değeri kontrol et
        return option.label;
      })[0]; // İlk eşleşeni al

    return statusText;
  }

  private updateProgress(): void {
    if (this.headerData) {
      try {
        const completedOrder = this.headerData.completedOrder || '0/0';
        const [totalValue, currentValue] = completedOrder.split('/').map(Number);
        this.progress = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
        this.loadingBarCurrentValue = currentValue;
        this.loadingBarTotalValue = totalValue;
      } catch (error) {
        console.error('Hata oluştu:', error);
        this.progress = 0; // Hata durumunda ilerlemeyi sıfırlar
      }
    }
  }

  applyFilters(): void {
    // Verileri filtreler ve sayfalandırır
    let filteredOrders = this.allOrdersData;

    filteredOrders = this.filterByProperty(filteredOrders, 'orderTrackingNo', this.filter.orderTrackingNo);
    filteredOrders = this.filterByProperty(filteredOrders, 'shipmentTrackingNo', this.filter.shipmentTrackingNo.toUpperCase());
    filteredOrders = this.filterByProperty(filteredOrders, 'plate', this.filter.plate);
    filteredOrders = this.filterByStatus(filteredOrders, this.filter.status);
    filteredOrders = this.filterByDistributionStatus(filteredOrders, this.filter.distributionStatus);
    filteredOrders = this.filterByDateRange(filteredOrders, this.dateRangeFormGroup.value.start, this.dateRangeFormGroup.value.end);

    this.ordersData = filteredOrders;
    this.currentPage = 1; // Sayfa numarasını sıfırlar
    this.updatePagedOrders(); // Sayfalandırılmış verileri günceller
    this.calculateTotalPages(); // Toplam sayfa sayısını hesaplar
  }

  private filterByProperty(orders: Order[], property: string, value: string): Order[] {
    // Belirli bir özelliğe göre filtreleme yapar
    return value ? orders.filter(order => (order as any)[property]?.includes(value)) : orders;
  }

  private filterByStatus(orders: Order[], status: Status | null): Order[] {
    // Duruma göre filtreleme yapar
    return status ? orders.filter(order => order.Statu === status) : orders;
  }

  private filterByDistributionStatus(orders: Order[], distributionStatus: DistributionStatus | null): Order[] {
    // Dağıtım durumuna göre filtreleme yapar
    return distributionStatus ? orders.filter(order => order.releasedForDistribution === distributionStatus) : orders;
  }

  private filterByDateRange(orders: Order[], startDate: Date | null, endDate: Date | null): Order[] {
    // Tarih aralığına göre filtreleme yapar
    if (startDate && endDate) {
      return orders.filter(order => {
        const orderDate = new Date(order.Date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    return orders;
  }

  clearFilters(): void {
    // Filtreleri temizler ve verileri yeniden yükler
    this.filter = {
      orderTrackingNo: '',
      shipmentTrackingNo: '',
      plate: '',
      startDate: null,
      endDate: null,
      status: null,
      distributionStatus: null
    };
    this.dateRangeFormGroup.reset();
    this.ordersData = [...this.allOrdersData]; // Tüm sipariş verilerini orijinal listeyi tekrar yükler
    this.currentPage = 1; // Sayfa numarasını sıfırlar
    this.updatePagedOrders(); // Sayfalandırılmış verileri günceller
    this.calculateTotalPages(); // Toplam sayfa sayısını hesaplar
  }

  navigateToOrderDetails(orderTrackingNo: string): void {
    // Sipariş detaylarına yönlendirir
    this.router.navigate(['/detail', orderTrackingNo]);
  }

  formatDate(dateString: string): string {
    // Tarih formatını günceller
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onItemsPerPageChange(event: Event): void {
    // Sayfa başına gösterim sayısını değiştirir
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = +select.value;
    this.currentPage = 1; // Sayfa numarasını sıfırlar
    this.updatePagedOrders(); // Sayfalandırılmış verileri günceller
    this.calculateTotalPages(); // Toplam sayfa sayısını hesaplar
  }

  onPageChange(event: Event): void {
    // Sayfa numarasını değiştirir
    const select = event.target as HTMLSelectElement;
    this.currentPage = +select.value;
    this.updatePagedOrders(); // Sayfalandırılmış verileri günceller
  }

  private updatePagedOrders(): void {
    // Sayfalandırılmış sipariş verilerini günceller
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedOrders = this.ordersData.slice(startIndex, endIndex);
  }

  private calculateTotalPages(): void {
    // Toplam sayfa sayısını hesaplar
    const totalPages = Math.ceil(this.ordersData.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
