import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AnalyticsService, DataTableService, DatePickerService, StatusService } from '../../../core';
import { Observable, Subscription } from 'rxjs';
import { LaunchDialogService } from '@spartacus/storefront';

@Component({
    selector: 'app-ticketDashlet',
    templateUrl: './ticketDashlet.component.html',
    styleUrls: ['../dashlet.component.scss'],
    standalone: false
})
export class TicketDashletComponent implements OnInit {
  selectedTab: string = '';
  currentDashlet: string;
  complaintData: number = 0;
  enquiryData: number = 0;
  problemData: number = 0;
  orderSubStatus: Observable<any>;
  OnModalConfirmation: boolean;
  closeData: any;
  dateRange: any;
  openData: any;
  newData: any;
  fromDate: any;
  toDate: any;
  chartOptions: any = [];
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
        if (this.currentDashlet == 'ticket') {
          this.subscription.add(this.statusService.selectedClosedData$.subscribe((closed) => {
            this.closeData = closed;
            this.updateTicketTotal();
            this._cdr.detectChanges();
          }))
          this.subscription.add(this.statusService.selectedOpenData$.subscribe((open) => {
            this.openData = open;
            this.updateTicketTotal();
            this._cdr.detectChanges();
          }))
          this.subscription.add(this.statusService.selectedNewData$.subscribe((newO) => {
            this.newData = newO;
            this.updateTicketTotal();
            this._cdr.detectChanges();
          }))
        }
      }
    }));
  }
  
  updateTicketTotal() {
    this.statusService.setTicketTotal(
      this.closeData,
      this.openData,
      this.newData
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
    this.dataTableService.setTicketStatus(data);
    this.dataTableService.setTicketTotal(total);
    localStorage.setItem("status", this.selectedTab);
    this.subscription.add(this.statusService.selectedEnquiryData$.subscribe((enquiry) => {
      this.enquiryData = enquiry;
      this._cdr.detectChanges();
    }));
    this.subscription.add(this.statusService.selectedComplaintData$.subscribe((complaint) => {
      this.complaintData = complaint;
      this._cdr.detectChanges();
    }));
    this.subscription.add(this.statusService.selectedProblemData$.subscribe((problem) => {
      this.problemData = problem;
      this._cdr.detectChanges();
    }));
    if (data == 'PROCESSING_ERROR' || data == 'inProgress' || data == 'REJECTED' || data == 'CANCELLED' || data == "created" || data == "Closed" || data == "Open" || data == "New") {
      this.OnModalConfirmation = true;
      this.statusService.onModalConfirmation(this.OnModalConfirmation);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
