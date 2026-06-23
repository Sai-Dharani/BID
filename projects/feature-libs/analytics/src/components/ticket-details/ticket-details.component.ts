import { Component, OnInit, inject } from '@angular/core';
import { AnalyticsService } from '../../core';
import { DataService } from '../shared/services/data.service';
import { RoutingService } from '@spartacus/core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-ticket-details',
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
    standalone: false
})
export class TicketDetailsComponent implements OnInit {
  subscription = new Subscription
  analyticsService = inject(AnalyticsService);
  dataService = inject(DataService);
  routingService = inject(RoutingService)
  ticketEvents: any = null;
  orderId: string;
  ngOnInit(): void {
    this.getTicketEvents()
  }
  getTicketEvents() {
    this.subscription.add(
      this.dataService.data$.subscribe(val => {
        if(!val && val===null){
          this.orderId= localStorage.getItem("dataService");
        }
        this.ticketEvents = val;
      }))
  }
  routeTo() {
    this.routingService.go({ cxRoute: 'details' });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}