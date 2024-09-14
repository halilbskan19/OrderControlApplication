import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BadgeComponent } from './components/badge/badge.component';
import { OrdersService } from './services/orders.service';
import { HeaderComponent } from './layout/header/header.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    BadgeComponent,
    HeaderComponent,
    OrdersComponent,
    LoadingBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [OrdersService],
  bootstrap: [AppComponent],
})
export class AppModule { }
