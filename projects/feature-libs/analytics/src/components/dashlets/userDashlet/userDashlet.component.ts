import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AnalyticsService, DataTableService, DatePickerService, StatusService } from '../../../core';
import { Observable, Subscription } from 'rxjs';
import { LaunchDialogService } from '@spartacus/storefront';
import { LAUNCH_CALLER } from '../../../modal-launch-caller.config';

@Component({
    selector: 'app-userDashlet',
    templateUrl: './userDashlet.component.html',
    styleUrls: ['../dashlet.component.scss'],
    standalone: false
})
export class UserDashletComponent implements OnInit {
  selectedTab: string;
  OnModalConfirmation: boolean;
  activeData: number = 0;
  inActiveData: number = 0;
  dateRange: any;
  fromDate: any;
  toDate: any;
  currentDashlet: any;
  chartOptions: any = [];
  completedData: any;

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
        this.subscription.add(this.statusService.selectedActiveData$.subscribe((active) => {
          this.activeData = active;
          this.updateUserTotal();
          this._cdr.detectChanges();
        }))
        this.subscription.add(this.statusService.selectedInactiveData$.subscribe((inactive) => {
          this.inActiveData = inactive;
          this.updateUserTotal();
          this._cdr.detectChanges();
        }))
      }
    }));
  }
  
  updateUserTotal() {
    this.statusService.setUserTotal(
      this.activeData,
      this.inActiveData
    );
  }
  ngAfterViewInit(): void {
      this.subscription.add(this.analytics.defaultFromDate$.subscribe((fromDate) => {
        this.fromDate = fromDate;
        this._cdr.detectChanges();
      }));
      this.subscription.add(this.analytics.currentToDate$.subscribe((toDate) => {
        this.toDate = toDate;
        this._cdr.detectChanges();
      }));
      this.getDays(this.fromDate, this.toDate);
      this.statusService.onModalConfirmation(false);
      this.chartDisplayOptions(this.dateRange);
  }
  onTabSelection(data, total) {
    debugger
    this.selectedTab = data;
    this.dataTableService.setUserStatus(data);
    this.dataTableService.setUsertotal(total);
    this.subscription.add(this.statusService.selectedActiveData$.subscribe((active) => {
      this.activeData = active;
      this._cdr.detectChanges();
    }));
    this.subscription.add(this.statusService.selectedInactiveData$.subscribe((inactive) => {
      this.inActiveData = inactive;
      this._cdr.detectChanges();
    }));
    localStorage.setItem("status", this.selectedTab);
    if (data == 'COMPLETED') {
      this.OnModalConfirmation = false;
      this.statusService.onModalConfirmation(this.OnModalConfirmation);
      this.onCreateModal();
    }
    else if (data == 'PROCESSING_ERROR' || data == 'inProgress' || data == 'REJECTED'
      || data == 'CANCELLED' || data == "created" || data == "Closed" || data == "Open"
      || data == "New" || data == "Web" || data == "WebMobile" || data == "CallCenter" || data == "active" || data == "inActive" || data == 'stuck' || data == 'completed'
      || data == 'cancelled' || data == 'failed' || data == 'inprogress') {
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
  getDays(fromDate, toDate) {
    let startDate = new Date(fromDate);
    let endDate = new Date(toDate);
    let Time = endDate.getTime() - startDate.getTime();
    let days = Time / (1000 * 3600 * 24);
    this.datePickerService.setDays(days);
    this.datePickerService.getFilterDates(fromDate, toDate);
    localStorage.setItem("fromDate", fromDate);
    localStorage.setItem("toDate", toDate);
    this.dateRange = 7;//we are showing 7 days data
    return days;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
