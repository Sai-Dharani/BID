import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { AnalyticsService, } from '../../core';
import { filter, Subscription } from 'rxjs';
import { LaunchDialogService } from '@spartacus/storefront';
import { DataService } from '../shared/services/data.service';
import { BaseSiteStateService } from '../basesite/basesite.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  standalone: false
})
export class OrderDetailsComponent implements OnInit {
  [x: string]: any;
  orderId: any;
  orderDate: any;
  orderPrice: any;
  orderStatus: any;
  fromDate: any;
  toDate: any;
  tableData: any;
  ticketData: any;
  orderDetailData: any;
  status: any;
  ticketDetailData: any;
  ticketSubject: any;
  ticketId: any;
  ticketCreatedAt: any;
  ticketModifiedAt: any;
  ticketStatus: any;
  ticketCategory: any;
  graphType = 'channel';
  currentDashlet: any;
  id: any;


  protected analytics = inject(AnalyticsService);
  protected _cdr = inject(ChangeDetectorRef);
  protected launchDialogService = inject(LaunchDialogService);
  protected routingService = inject(RoutingService);
  protected dataService = inject(DataService);
  protected baseSiteStateService = inject(BaseSiteStateService);
  protected subscription = new Subscription();

  ngOnInit() {
    this.initData();

    if (this.currentDashlet == 'order') {
      this.orderDaslet();
    }
    if (this.currentDashlet == 'ticket') {
      this.ticketDashlet();
    }
    if (this.currentDashlet == 'channel') {
      this.channelDashlet();
    }
  }
  orderDaslet() {
    this.subscription.add(
      this.baseSiteStateService.baseSite$
        .pipe(filter(basesite => basesite !== undefined))
        .subscribe(basesite => {
          console.log('Active BaseSite in Order Details Component:', basesite);
          if (basesite === 'All') {
            basesite = '';
          }
          this.subscription = this.analytics.getOrderDataWithStatus(this.fromDate, this.status, this.toDate, basesite).subscribe((res) => {
            this.tableData = res.orders;
            for (const element of this.tableData) {
              if (this.id == element.code) {
                this.orderDetailData = element;
                this.orderId = this.orderDetailData.code;
                this.orderDate = this.orderDetailData.placed;
                this.orderPrice = this.orderDetailData.total.formattedValue;
                this.orderStatus = this.orderDetailData.status;
                this._cdr.detectChanges();
              }
            }
            this.analytics.getTicketDataWithOrderNo(this.orderId).subscribe((res) => {
              if (res.tickets) {
                this.ticketData = res.tickets;
              } else {
                this.ticketData = 0;
              }
            });
          })
        }));
  }
  ticketDashlet() {
    this.subscription.add(
      this.baseSiteStateService.baseSite$
        .pipe(filter(basesite => basesite !== undefined))
        .subscribe(basesite => {
          console.log('Active BaseSite in Order Details Component:', basesite);
          if (basesite === 'All') {
            basesite = '';
          }
          this.subscription = this.analytics.getTicketDataWithStatus(this.fromDate, this.status, this.toDate, basesite).subscribe((res) => {
            this.tableData = res.tickets;
            for (const element of this.tableData) {
              if (this.id == element.id) {
                this.ticketDetailData = element;
                this.ticketSubject = this.ticketDetailData.subject;
                this.ticketId = this.ticketDetailData.id;
                this.ticketCreatedAt = this.ticketDetailData.createdAt;
                this.ticketModifiedAt = this.ticketDetailData.modifiedAt;
                this.ticketStatus = this.ticketDetailData.status.name;
                this.ticketCategory = this.ticketDetailData.ticketCategory.name;
                this['ticketCustomerId'] = this.ticketDetailData.customerId;
                this['ticketEvents'] = this.ticketDetailData.ticketEvents;
                //
                this.analytics.getOrderDataUsingTicketID(this['ticketCustomerId'], this.ticketId).subscribe((data) => {
                  this.orderId = data.associatedTo.code;
                })
                this._cdr.detectChanges();
              }
            }
          })
        }));
    setTimeout(() => {
    }, 0)
  }
  channelDashlet() {
    this.subscription.add(
      this.baseSiteStateService.baseSite$
        .pipe(filter(basesite => basesite !== undefined))
        .subscribe(basesite => {
          console.log('Active BaseSite in Order Details Component:', basesite);
          if (basesite === 'All') {
            basesite = '';
          }
          this.subscription = this.analytics.getChannelDataWithStatus(this.fromDate, this.graphType, this.status, this.toDate, basesite).subscribe((res) => {
            this.tableData = res.orders;
            for (const element of this.tableData) {
              if (this.id == element.code) {
                this.orderDetailData = element;
                this.orderId = this.orderDetailData.code;
                this.orderDate = this.orderDetailData.placed;
                this.orderPrice = this.orderDetailData.total.formattedValue;
                this.orderStatus = this.orderDetailData.status;
                this._cdr.detectChanges();
              }
            }
            this.analytics.getTicketDataWithOrderNo(this.orderId).subscribe((res) => {
              if (res.tickets) {
                this.ticketData = res.tickets;
              } else {
                this.ticketData = 0;
              }
            });
          })
        }));
  }
  initData() {
    this.id = localStorage.getItem('Id');
    this.fromDate = localStorage.getItem('fromDate');
    this.toDate = localStorage.getItem('toDate');
    this.status = localStorage.getItem('status');

    this.analytics.currentDashlet$.subscribe((dashlet) => {
      if (JSON.stringify(dashlet) !== '{}') {
        this.currentDashlet = dashlet;
      } else {
        this.currentDashlet = localStorage.getItem("currentDashlet");
      }
    })
  }

  routeTo() {
    window.history.back();
  }

  cancel() {
    this.subscription.unsubscribe();
  }

  closeModal() {
    this.launchDialogService.closeDialog(true);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks  
    this.subscription.unsubscribe();
  }
  gotoTicketDetails(ticketData) {
    this.closeModal()
    this.dataService.setData(ticketData);
    this.routingService.go("ticketDetails");
  }
  gotoOrderSummary(ticketData) {
    this.closeModal()
    this.dataService.setData(ticketData);
    this.routingService.go("orderSummary");
  }
}
