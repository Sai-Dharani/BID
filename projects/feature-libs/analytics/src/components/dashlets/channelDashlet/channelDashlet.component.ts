import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AnalyticsService, DataTableService, DatePickerService, StatusService } from '../../../core';
import { Observable, Subscription } from 'rxjs';
import { LaunchDialogService } from '@spartacus/storefront';
import { LAUNCH_CALLER } from '../../../modal-launch-caller.config';

@Component({
    selector: 'app-channelDashlet',
    templateUrl: './channelDashlet.component.html',
    styleUrls: ['../dashlet.component.scss'],
    standalone: false
})
export class ChannelDashletComponent implements OnInit {
  selectedTab: string;
  OnModalConfirmation: boolean;
  completedData: any;
  webData: any;
  webMobileData: any;
  callCenterData: any;
  dateRange: any;
  fromDate: any;
  toDate: any;
  currentDashlet: any;
  chartOptions: any = [];

  orderSubStatus: Observable<any>;
  protected subscription = new Subscription();

  dataTableService = inject(DataTableService);
  statusService = inject(StatusService);
  _cdr = inject(ChangeDetectorRef);
  launchDialogService = inject(LaunchDialogService);
  analytics = inject(AnalyticsService);
  datePickerService = inject(DatePickerService);
  ngOnInit(): void {
    this.subscription.add(this.datePickerService.selectedFromDate$.subscribe((fromDate) => {
      this.fromDate = fromDate;
      this.selectedTab = '';
    }))
    this.subscription.add(this.datePickerService.selectedToDate$.subscribe((toDate) => {
      this.toDate = toDate;
      this.selectedTab = '';
    }))
    this.subscription.add(this.statusService.modalConfirmation$.subscribe((flag) => {
      this.OnModalConfirmation = flag;
      this._cdr.detectChanges();
    }))
    this.subscription.add(this.analytics.currentDashlet$.subscribe((dashlet) => {
      if (JSON.stringify(dashlet) !== '{}') {
        this.currentDashlet = dashlet;
      } else {
        this.currentDashlet = localStorage.getItem("currentDashlet");
      }
    }))
    this.subscription.add(this.datePickerService.selectedProduct$.subscribe((val) => {
      this.dateRange = val;
      this.chartDisplayOptions(this.dateRange);
      this.selectedTab = '';
      if (JSON.stringify(this.dateRange) !== '{}') {
        if (this.currentDashlet == 'channel') {
          this.subscription.add(this.statusService.selectedWebData$.subscribe((web) => {
            this.webData = web;
            this.updateChannelTotal();
            this._cdr.detectChanges();
          }))
          this.subscription.add(this.statusService.selectedWebMobileData$.subscribe((webMobile) => {
            this.webMobileData = webMobile;
            this.updateChannelTotal();
            this._cdr.detectChanges();
          }))
          this.subscription.add(this.statusService.selectedCallCenterData$.subscribe((callCenter) => {
            this.callCenterData = callCenter;
            this.updateChannelTotal();
            this._cdr.detectChanges();
          }))
        }
      }
    }));
  }
  
  updateChannelTotal() {
    this.statusService.setChannelTotal(
      this.webData,
      this.webMobileData,
      this.callCenterData
    );
  }
  chartDisplayOptions(dateRange) {
    if (dateRange <= 10) {
      this.chartOptions = ['Date'];
    }
    else if (dateRange > 10 && dateRange <= 60) {
      this.chartOptions = ['Week'];
    }
    else if (dateRange > 60 && dateRange <= 365) {
      this.chartOptions = ['Month'];
    }
    else if (dateRange > 365) {
      this.chartOptions = ['Year'];
    }
  }
  onTabSelection(data, total) {
    this.selectedTab = data;
    this.dataTableService.setChannelStatus(data);
    this.dataTableService.setChannelTotal(total);
    this.orderSubStatus = this.statusService.selectedOrderSubStatus$;
    localStorage.setItem("status", this.selectedTab);
    if (data == 'PROCESSING_ERROR' || data == 'inProgress' || data == 'REJECTED' || data == 'CANCELLED' || data == "created" || data == "Closed" || data == "Open" || data == "New" || data == "Web" || data == "WebMobile" || data == "CallCenter" || data == "active" || data == "inActive" || data == 'stuck' || data == 'completed' || data == 'cancelled' || data == 'failed' || data == 'inprogress') {
      this.OnModalConfirmation = true;
      this.statusService.onModalConfirmation(this.OnModalConfirmation);
    }
  }
  onCreateModal() {
    if (this.completedData > 0) {
      this.launchDialogService.openDialogAndSubscribe(
        LAUNCH_CALLER.CONFIRMATION_MODAL_POPUP,
      );
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
