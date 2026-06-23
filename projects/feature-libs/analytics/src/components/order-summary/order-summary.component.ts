import { Component, OnInit, inject } from '@angular/core';
import { AnalyticsService } from '../../core';
import { DataService } from '../shared/services/data.service';
import { RoutingService} from '@spartacus/core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-order-summmary',
    templateUrl: './order-summary.component.html',
    styleUrls: ['./order-summary.component.scss'],
    standalone: false
})
export class OrderSummaryComponent {
  subscription = new Subscription
  analyticsService = inject(AnalyticsService);
  dataService = inject(DataService);
  routingService = inject(RoutingService);
  orderId: string;
  customerId: string = '';
  orderData: any;
  constructor(){
    this.getTicketEvents()
  }
  getTicketEvents() {
    this.orderId = localStorage.getItem("dataService");
    this.subscription.add(
      this.analyticsService.getOrder(this.orderId).subscribe(res => {
        this.orderData = res;
        console.log(this.orderData)
      })
    )   
  }
  routeTo() {
    this.routingService.go({ cxRoute: 'details' });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
