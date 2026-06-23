import { Component, OnDestroy, Input, OnInit, OnChanges, inject } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { filter, Subscription } from 'rxjs';
import { DatePickerService, StatusService } from '../../../core';
import { AnalyticsService } from '../../../core/facade/analytics.service';
import { CustomAdapter } from '../../shared/datepicker/datepicker.component';
import { Router } from '@angular/router';
import { BaseSiteStateService } from '../../basesite/basesite.service';
@Component({
  selector: 'app-order-summary-chart',
  templateUrl: './order-summary-chart.component.html',
  styleUrls: ['./order-summary-chart.component.scss'],
  standalone: false
})
export class OrderSummaryChartComponent implements OnDestroy, OnInit, OnChanges {
  @Input() chartName: any;
  @Input() chartType: any;
  @Input() chartPage: any;
  result = [];
  labelArray = [];
  days: any;
  chart: any;
  chart_name: any;
  fromDate: any;
  toDate: any;
  chartData: any;
  stuckArray = [];
  progressArray = [];
  failureArray = [];
  completedArray = [];
  cancelledArray = [];
  protected subscription = new Subscription();
  totalStuck: any;
  totalProgress: any;
  totalFailure: any;
  totalCompleted: any;
  totalCancelled: any;
  graphType = 'channel';

  protected datePickerService = inject(DatePickerService);
  protected analyticsService = inject(AnalyticsService);
  protected statusService = inject(StatusService);
  protected calendar = inject(NgbCalendar);
  protected customAdapter = inject(CustomAdapter);
  protected router = inject(Router);
  protected baseSiteStateService = inject(BaseSiteStateService);

  ngOnInit(): void {
    if (this.router.url == '/details') {
      this.subscription.add(this.datePickerService.selectedProduct$.subscribe((val) => {
        this.days = val;
      }))
      this.subscription.add(this.datePickerService.selectedFromDate$.subscribe((fromDate) => {
        this.fromDate = fromDate;
      }))
      this.subscription.add(this.datePickerService.selectedToDate$.subscribe((toDate) => {
        this.toDate = toDate;
      }))
    } else if (this.router.url == '/analytics' || this.router.url == '/') {
      // Subscribe to baseSite changes for analytics page
      this.subscription.add(
        this.baseSiteStateService.baseSite$
          .pipe(filter(basesite => basesite !== undefined))
          .subscribe(basesite => {
            console.log('Active BaseSite in Order Summary Component:', basesite);
            this.monthlyOrderSummary(basesite);
          })
      );
    }
  }
  ngAfterViewInit() {
    // Initialization moved to ngOnInit for analytics page
  }
  ngOnChanges() {
    setTimeout(() => {
      if (this.days > 0 && this.router.url == '/details') {
        this.subscription.add(
          this.baseSiteStateService.baseSite$
            .pipe(filter(basesite => basesite !== undefined))
            .subscribe(basesite => {
              console.log('Active BaseSite in Ticket Component:', basesite);
              if (basesite === 'All') {
                basesite = '';
              }
              this.subscription.add(this.analyticsService.getOrderData(this.fromDate, this.toDate, basesite).subscribe((response) => {
                this.dynamicOrderChart(response);
              }));
            }));
      }
    }, 200);
  }
  getLastWeek() {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return lastWeek;
  }
  monthlyOrderSummary(basesite: string) {
    let date = this.calendar.getToday();
    let toDate = new NgbDate(
      date.year,
      date.month,
      date.day
    );
    let lastWeek = this.getLastWeek();
    let lastWeekMonth = lastWeek.getMonth() + 1;
    let lastWeekDay = lastWeek.getDate();
    let lastWeekYear = lastWeek.getFullYear();
    let lastWeekDisplay = lastWeekYear + "-" + lastWeekMonth + "-" + lastWeekDay;

    let fromDate = lastWeekDisplay;
    let tDate = this.customAdapter.toModel(toDate);

    this.analyticsService.getdashboardPageDates(fromDate, tDate);

    if (basesite === 'All') {
      basesite = '';
    }
    this.subscription.add(this.analyticsService.getOrderData(fromDate, tDate, basesite).subscribe((response) => {
      this.orderChart(response);
    }));
  }
  orderChart(monthlyOrderData) {
    this.orderStatus(monthlyOrderData);
    let chartExist = Chart.getChart("orderSummary"); // <canvas> id
    if (chartExist != undefined) {
      chartExist.destroy();
    }
    this.chart = new Chart('orderSummary', {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ["Stuck", "Progress", "Completed", "Failure", "Cancelled"],
        datasets: [
          {
            label: "order status",
            data: [this.totalStuck, this.totalProgress, this.totalCompleted, this.totalFailure, this.totalCancelled],
            backgroundColor: ['#81dee5', '#845bf6', '#93d569', '#ec635d', '#ffd966'],
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
      }
    })
  }
  orderStatus(chartData) {
    // Clear arrays before processing new data
    this.stuckArray = [];
    this.progressArray = [];
    this.failureArray = [];
    this.completedArray = [];
    this.cancelledArray = [];
    
    let data;
    data = chartData.biaOrderListCountForGraph;
    data.forEach(element => {
      this.stuckArray.push(element.orderCountList.stuckOrders);
      this.progressArray.push(element.orderCountList.inProgressOrders);
      this.failureArray.push(element.orderCountList.failedOrders);
      this.completedArray.push(element.orderCountList.completedOrders);
      this.cancelledArray.push(element.orderCountList.cancelledOrders);
    })
    this.totalStuck = this.stuckArray.reduce((acc, cur) => acc + cur, 0);
    this.totalProgress = this.progressArray.reduce((acc, cur) => acc + cur, 0);
    this.totalFailure = this.failureArray.reduce((acc, cur) => acc + cur, 0);
    this.totalCompleted = this.completedArray.reduce((acc, cur) => acc + cur, 0);
    this.totalCancelled = this.cancelledArray.reduce((acc, cur) => acc + cur, 0);
  }
  //For Order
  dynamicOrderChart(dynamicData) {
    this.result = [];
    this.labelArray = [];
    this.stuckArray = [];
    this.progressArray = [];
    this.failureArray = [];
    this.completedArray = [];
    this.cancelledArray = [];
    this.chart_name = this.chartName[0];
    if (this.chart_name == 'Week' || this.chart_name == 'Year' || this.chart_name == 'Date' || this.chart_name == 'Month') {
      let data;
      data = dynamicData.biaOrderListCountForGraph;
      data.forEach(element => {
        this.labelArray.push(element.label);
      })
      this.orderStatus(dynamicData);
      this.statusService.stuckedOrders(this.totalStuck);
      this.statusService.progressOrders(this.totalProgress);
      this.statusService.failedOrders(this.totalFailure);
      this.statusService.completedOrders(this.totalCompleted);
      this.statusService.cancelledOrders(this.totalCancelled);
      let chartExist = Chart.getChart(this.chart_name); // <canvas> id
      if (chartExist != undefined) {
        console.log(chartExist);
        chartExist.destroy();
      }
      console.log(this.chartType);
      this.chart = new Chart(this.chart_name, {
        type: this.chartType, //this denotes tha type of chart
        data: {// values on X-Axis
          labels: this.labelArray,
          datasets: [
            {
              label: "Stuck",
              data: this.stuckArray,
              backgroundColor: ['#81dee5'],
              borderColor: ['#81dee5']
            },
            {
              label: "Progress",
              data: this.progressArray,
              backgroundColor: ['#845bf6'],
              borderColor: ['#845bf6']
            },
            {
              label: "Completed",
              data: this.completedArray,
              backgroundColor: ['#93d569'],
              borderColor: ['#93d569']
            },
            {
              label: "Failure",
              data: this.failureArray,
              backgroundColor: ['#ec635d'],
              borderColor: ['#ec635d']
            },
            {
              label: "Cancelled",
              data: this.cancelledArray,
              backgroundColor: ['#ffd966'],
              borderColor: ['#ffd966']
            },
          ]
        },
        options: {
          maintainAspectRatio: false,
        },
      })
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
