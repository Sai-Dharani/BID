import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AnalyticsService, DataTableService, DatePickerService, StatusService } from '../../../core';
import { Observable, Subscription } from 'rxjs';
import { LaunchDialogService } from '@spartacus/storefront';
import { LAUNCH_CALLER } from '../../../modal-launch-caller.config';

@Component({
    selector: 'app-cronJobDashlet',
    templateUrl: './cronJobDashlet.component.html',
    styleUrls: ['../dashlet.component.scss'],
    standalone: false
})
export class CronJobDashletComponent implements OnInit {
  selectedTab: string;
  OnModalConfirmation: boolean;
  completedData: any;
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
  errorData: any;
  failedData: any;
  successData: any;
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
        if (this.currentDashlet == 'cronJob') {
          this.subscription.add(this.statusService.selectedErrorCronJobData$.subscribe((error) => {
            this.errorData = error;
            this.updateCronJobTotal();
            this._cdr.detectChanges();
          }))
          this.subscription.add(this.statusService.selectedFailedCronJobData$.subscribe((failed) => {
            this.failedData = failed;
            this.updateCronJobTotal();
            this._cdr.detectChanges();
          }))
          this.subscription.add(this.statusService.selectedSuccessCronJobData$.subscribe((success) => {
            this.successData = success;
            this.updateCronJobTotal();
            this._cdr.detectChanges();
          }))
        }
      }
    }));
  }
  
  updateCronJobTotal() {
    this.statusService.setCronJobTotal(
      this.errorData,
      this.successData,
      this.failedData
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
    this.dataTableService.setCronJobTotal(total);
    localStorage.setItem("status", this.selectedTab);
    if (data == 'PROCESSING_ERROR' || data == 'inProgress' || data == 'REJECTED' || data == 'CANCELLED' || data == "created" || data == "Closed" || data == "Open" || data == "New" || data == "Web" || data == "WebMobile" || data == "CallCenter" || data == "active" || data == "inActive" || data == 'stuck' || data == 'completed' || data == 'cancelled' || data == 'failed' || data == 'inprogress' || data == 'Error' || data == 'Success' || data == 'Failed') {
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
