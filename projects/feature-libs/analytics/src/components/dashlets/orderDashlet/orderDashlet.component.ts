import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AnalyticsService, DataTableService, DatePickerService, StatusService } from '../../../core';
import { Observable, Subscription } from 'rxjs';
import {  LaunchDialogService } from '@spartacus/storefront';
import { LAUNCH_CALLER } from '../../../modal-launch-caller.config';

@Component({
    selector: 'app-orderDashlet',
    templateUrl: './orderDashlet.component.html',
    styleUrls: ['../dashlet.component.scss'],
    standalone: false
})
export class OrderDashletComponent implements OnInit {
  selectedTab: string = '';
  stuckData: any;
  dateRange: any;
  progressData: any;
  completedData: any;
  failedData: any;
  cancelledData: any;
  currentDashlet: string;
  fromDate: any;
  toDate: any;
  OnModalConfirmation: boolean;
  orderSubStatus: Observable<any>;
  chartOptions: any = [];
  protected subscription = new Subscription();
  dataTableService = inject(DataTableService);
  statusService = inject(StatusService);
  _cdr = inject(ChangeDetectorRef);
  launchDialogService = inject(LaunchDialogService);
  analytics = inject(AnalyticsService);
  datePickerService= inject(DatePickerService);
  ngOnInit(): void {
    this.subscription.add(this.analytics.currentDashlet$.subscribe((dashlet) => {
      this.subscription.add(this.datePickerService.selectedFromDate$.subscribe((fromDate) => {
        this.fromDate = fromDate;
          this.selectedTab = '';
      }))
      this.subscription.add(this.datePickerService.selectedToDate$.subscribe((toDate) => {
        this.toDate = toDate;
          this.selectedTab = '';
      }))
      this.subscription.add(this.statusService.modalConfirmation$.subscribe((flag)=>{
        this.OnModalConfirmation = flag;
        this._cdr.detectChanges();
      }))
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
        this.subscription.add(this.statusService.selectedstuckData$.subscribe((stuck) => {
          this.stuckData = stuck;
          this.updateOrderTotal();
          this._cdr.detectChanges();
        }))
        this.subscription.add(this.statusService.selectedprogressData$.subscribe((progress) => {
          this.progressData = progress;
          this.updateOrderTotal();
          this._cdr.detectChanges();
        }))
        this.subscription.add(this.statusService.selectedfailedData$.subscribe((failed) => {
          this.failedData = failed;
          this.updateOrderTotal();
          this._cdr.detectChanges();
        }))
        this.subscription.add(this.statusService.selectedcompletedData$.subscribe((completed) => {
          this.completedData = completed;
          this.updateOrderTotal();
          this._cdr.detectChanges();
        }))
        this.subscription.add(this.statusService.selectedcancelledData$.subscribe((cancelled) => {
          this.cancelledData = cancelled;
          this.updateOrderTotal();
          this._cdr.detectChanges();
        }))
      }
    }));
  }
  
  updateOrderTotal() {
    this.statusService.setOrderTotal(
      this.stuckData,
      this.progressData,
      this.completedData,
      this.failedData,
      this.cancelledData
    );
  }
  onTabSelection(data, total) {
    this.selectedTab = data;
    if (this.currentDashlet == 'order') {
      this.dataTableService.setorderStatus(data);
      this.dataTableService.setOrderTotal(total);
      this.orderSubStatus = this.statusService.selectedOrderSubStatus$;
    }
    localStorage.setItem("status", this.selectedTab);
    if (data == 'COMPLETED') {
      this.OnModalConfirmation = false;
      this.statusService.onModalConfirmation(this.OnModalConfirmation);
      this.onCreateModal();
    }
    else if (data == 'PROCESSING_ERROR' || data == 'inProgress' || data == 'REJECTED'
      || data == 'CANCELLED' || data == "created" || data == "Closed" || data == "Open"
      || data == "New" || data == "Web" || data == "WebMobile" || data == "CallCenter" || data == "active" || data == "inActive" || data == 'stuck' || data == 'completed'
      || data == 'cancelled' || data == 'failure' || data == 'inprogress') {
      this.OnModalConfirmation = true;
      this.statusService.onModalConfirmation(this.OnModalConfirmation);
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
