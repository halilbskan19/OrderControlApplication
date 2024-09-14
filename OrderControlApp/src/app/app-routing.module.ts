import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

const routes: Routes = [
  { path: 'detail/:orderTrackingNo', component: OrderDetailComponent },
  { path: 'home', component: OrdersComponent },

  // Herhangi bir yol ile eşleşecek ve /home'a yönlendirecek wildcard yolu
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
