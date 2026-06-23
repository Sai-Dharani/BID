import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AnalyticsService, DatePickerService, StatusService } from '../../core';
import { RoutingService } from '@spartacus/core';


@Component({
    selector: 'app-side-nav',
    templateUrl: './sideNav.component.html',
    styleUrls: ['./sideNav.component.scss'],
    standalone: false
})
export class SideNavComponent implements OnInit {
  currentDashlet: any;
  activeTabName: string = 'SAP Commerce';
  orderTotal: number = 0;
  ticketTotal: number = 0;
  channelTotal: number = 0;
  cronJobTotal: number = 0;
  userTotal: number = 0;
  cdr = inject(ChangeDetectorRef)
  routingService = inject(RoutingService)
  analyticsServices = inject(AnalyticsService)
  private datePickerService = inject(DatePickerService);
  private statusService = inject(StatusService);
 
  ngOnInit(): void {
    this.currentDashlet = localStorage.getItem("currentDashlet");
    this.analyticsServices.currentActiveTab$.subscribe(tab => {
      this.activeTabName = tab;
    });

    // Subscribe to total counts
    this.statusService.selectedOrderTotal$.subscribe(total => {
      this.orderTotal = total;
      this.cdr.detectChanges();
    });

    this.statusService.selectedTicketTotal$.subscribe(total => {
      this.ticketTotal = total;
      this.cdr.detectChanges();
    });

    this.statusService.selectedChannelTotal$.subscribe(total => {
      this.channelTotal = total;
      this.cdr.detectChanges();
    });

    this.statusService.selectedCronJobTotal$.subscribe(total => {
      this.cronJobTotal = total;
      this.cdr.detectChanges();
    });

    this.statusService.selectedUserTotal$.subscribe(total => {
      this.userTotal = total;
      this.cdr.detectChanges();
    });
  }
  setDashlet(dashlet) {
    this.currentDashlet = dashlet
    console.log(dashlet)
    localStorage.setItem("fromDate", '');
    localStorage.setItem("toDate", '');
    this.datePickerService.setDays(0);
    this.routingService.go({ cxRoute: 'details' });
    this.analyticsServices.setCurrentDashlet(dashlet);
    localStorage.setItem("currentDashlet", dashlet);
    this.datePickerService.resetDates();
    this.cdr.detectChanges();
  }
}