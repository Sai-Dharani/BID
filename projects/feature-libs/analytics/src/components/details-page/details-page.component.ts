import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService, DatePickerService, StatusService } from '../../core';
@Component({
    selector: 'app-details-page',
    templateUrl: './details-page.component.html',
    styleUrls: ['./details-page.component.scss'],
    standalone: false
})
export class DetailsPageComponent implements OnInit, OnDestroy {
  //needed
  chartType: any;
  dateRange: any;
  chartOptions: any = [];
  selectedChartOption = 'bar';
  OnModalConfirmation: any;
  currentDashlet: any;
  ticketPrediction: any;
  predictLoading: boolean = false;
  predictionError: string | null = null;
  showPredictionSection: boolean = false;

  //not needed
  //selectedOption = 'none';

  protected subscription = new Subscription();
  private datePickerService = inject(DatePickerService);
  private statusService = inject(StatusService);
  private _cdr = inject(ChangeDetectorRef);
  private analytics = inject(AnalyticsService);

  ngOnInit(): void {
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
      // Clear prediction data when switching dashlets
      if (this.currentDashlet !== 'ticket') {
        this.ticketPrediction = null;
        this.predictionError = null;
      }
    }))
    this.subscription.add(this.datePickerService.selectedProduct$.subscribe((val) => {
      this.dateRange = val;
      this.chartDisplayOptions(this.dateRange);
      // Clear prediction data when date range changes
      this.ticketPrediction = null;
      this.predictionError = null;
    }));

    this.subscription.add(this.analytics.currentTicketPrediction$.subscribe((prediction) => {
      this.ticketPrediction = prediction;
    }));
  }
  //needed
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
  //needed
  selectedChart() {
    this.chartType = this.selectedChartOption;
  }

  canPredictTicket(): boolean {
    const fromDate = localStorage.getItem("fromDate");
    const toDate = localStorage.getItem("toDate");
    return !!fromDate && !!toDate && !this.predictLoading;
  }

  predictTicket() {
    const fromDate = localStorage.getItem("fromDate");
    const toDate = localStorage.getItem("toDate");
    if (!fromDate || !toDate || this.predictLoading) {
      return;
    }
    this.predictLoading = true;
    this.predictionError = null;
    this._cdr.markForCheck();
    this.subscription.add(
      this.analytics.getTicketPrediction(fromDate, toDate).subscribe(
        (response) => {
          this.analytics.setTicketPrediction(response);
          this.predictLoading = false;
          this.predictionError = null;
          this.showPredictionSection = true;
          this._cdr.markForCheck();
        },
        (error) => {
          console.error('Prediction error:', error);
          this.handlePredictionError(error);
          this.predictLoading = false;
          this._cdr.markForCheck();
        }
      )
    );
  }

  handlePredictionError(error: any): void {
    // Check for TooManyRequests error (HTTP 429)
    if (error?.status === 429 || error?.error?.type === 'TooManyRequests') {
      this.predictionError = '⚠️ Server is busy. Please try again after some time.';
    }
    // Check for service unavailable (HTTP 503)
    else if (error?.status === 503) {
      this.predictionError = '⚠️ Service temporarily unavailable. Please try again later.';
    }
    // Check for general server error (HTTP 5xx)
    else if (error?.status >= 500) {
      this.predictionError = '⚠️ Server error occurred. Please try again after some time.';
    }
    // Check for network or timeout errors
    else if (error?.status === 0 || error?.name === 'TimeoutError') {
      this.predictionError = '⚠️ Connection error. Please check your network and try again.';
    }
    // Check for bad request (HTTP 400)
    else if (error?.status === 400) {
      this.predictionError = '⚠️ There is a rate limit for the free tier. If too many requests are sent within a short period, an error may occur. Please try again after some time.';
    }
    // Generic error message
    else {
      this.predictionError = '⚠️ Unable to generate prediction. Please try again.';
    }
  }

  formatLabel(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase())
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatValue(value: any): any {
    if (typeof value === 'string') {
      return value.replace(/^"|"$/g, '');
    }
    return value;
  }

  isPredictionArray(): boolean {
    return Array.isArray(this.ticketPrediction);
  }

  getPredictionColumns(): string[] {
    if (!this.isPredictionArray() || !this.ticketPrediction?.length) {
      return [];
    }

    return Object.keys(this.ticketPrediction[0] || {});
  }

  getPredictionRows(): any[] {
    return this.isPredictionArray() ? this.ticketPrediction : [];
  }

  getPrimaryTicketCount(): any {
    return this.ticketPrediction?.ticketCount ?? (this.isPredictionArray() ? this.getPredictionRows()[0]?.ticketCount : null);
  }

  formatTicketCount(value: any): string {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '-';
  }

  getPredictionEntries(): { key: string; value: any }[] {
    if (!this.ticketPrediction || this.isPredictionArray() || typeof this.ticketPrediction !== 'object') {
      return [];
    }

    return Object.entries(this.ticketPrediction).map(([key, value]) => ({ key, value }));
  }

  hasNoData(): boolean {
    if (!this.ticketPrediction) {
      return true;
    }
    if (this.isPredictionArray()) {
      return !Array.isArray(this.ticketPrediction) || this.ticketPrediction.length === 0;
    }
    return Object.keys(this.ticketPrediction).length === 0;
  }

  ngOnDestroy(): void {
    // Clear prediction data when component is destroyed
    this.ticketPrediction = null;
    this.predictionError = null;
    this.showPredictionSection = false;
    this.analytics.setTicketPrediction(null);
    this.subscription.unsubscribe();
  }
  setDashlet(dashlet) {
    localStorage.setItem("currentDashlet", dashlet);
    this._cdr.detectChanges();
  }
}
