import { Component, OnDestroy, ChangeDetectorRef, inject, Input } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { DatePickerService, StatusService } from '../../../core';
import { AnalyticsService } from '../../../core/facade/analytics.service';
import { CustomAdapter } from '../../shared/datepicker/datepicker.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cron-job',
    templateUrl: './cron-job.component.html',
    styleUrls: ['./cron-job.component.scss'],
    standalone: false
})
export class CronJobComponent implements OnDestroy {
  @Input() chartName: any;
  @Input() chartType: any;
  @Input() chartPage: any;
  chart: any;
  fromDate: any;
  toDate: any;
  chartData: any;
  errorCronjobArray = [];
  failedCronjobArray = [];
  successCronjobArray = [];
  protected subscription = new Subscription();
  totalError: any;
  totalFailed: any;
  totalSuccess: any;
  graphType = 'channel';

  private datePickerService = inject(DatePickerService);
  private analyticsService = inject(AnalyticsService);
  private statusService = inject(StatusService);
  private calendar = inject(NgbCalendar);
  private customAdapter = inject(CustomAdapter);
  private _cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  result: any[];
  labelArray: any[];
  chart_name: string;
  days: any;

  ngAfterViewInit() {
    this.monthlyCronJobSummary();
  }
  getLastWeek() {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return lastWeek;
  }

  ngOnInit() {
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
    }
  }

  ngOnChanges() {
    setTimeout(() => {
      if (this.days > 0 && this.router.url == '/details') {
        this.subscription.add(this.analyticsService.getCronJob(this.fromDate, this.toDate).subscribe((response) => {
          this.dynamicCronJobChart(response);
        }))
      }
    }, 200);
  }

  monthlyCronJobSummary() {
    if (this.router.url == '/analytics' || this.router.url == '/') {
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


      this.subscription.add(this.analyticsService.getCronJob(fromDate, tDate).subscribe((response) => {
        this.cronJobChart(response);
      }))
    }
  }
  cronJobChart(monthlyCronJobData) {
    this.cronJobStatus(monthlyCronJobData);
    let chartExist = Chart.getChart("cronJob"); // <canvas> id
    if (chartExist != undefined) {
      chartExist.destroy();
    }
    this.chart = new Chart('cronJob', {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ["Error", "Failed", "Success"],
        datasets: [
          {
            label: "cronJob status",
            data: [this.totalError, this.totalFailed, this.totalSuccess],
            backgroundColor: ['#81dee5', '#845bf6', '#93d569'],
            borderColor: "rgba(0,0,255,0.1)",
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
      }
    });
  }
  cronJobStatus(chartData) {
    if (!chartData || !chartData.biaCronjobListCountForGraph) {
      return;
    }
    let data;
    data = chartData.biaCronjobListCountForGraph;
    data.forEach(element => {
      this.errorCronjobArray.push(element.cronjobCountList.errorCronjobs);
      this.failedCronjobArray.push(element.cronjobCountList.failedCronjobs);
      this.successCronjobArray.push(element.cronjobCountList.successCronjobs);
    })
    this.totalError = this.errorCronjobArray.reduce((acc, cur) => acc + cur, 0);
    this.totalFailed = this.failedCronjobArray.reduce((acc, cur) => acc + cur, 0);
    this.totalSuccess = this.successCronjobArray.reduce((acc, cur) => acc + cur, 0);
  }

  dynamicCronJobChart(dynamicData) {
    this.result = [];
    this.labelArray = [];
    this.errorCronjobArray = [];
    this.failedCronjobArray = [];
    this.successCronjobArray = [];
    this.chart_name = this.chartName[0];
    if (this.chart_name == 'Week' || this.chart_name == 'Year' || this.chart_name == 'Date' || this.chart_name == 'Month') {
      let data;
      data = dynamicData.biaCronjobListCountForGraph;
      data.forEach(element => {
        this.labelArray.push(element.label);
      })
      this.cronJobStatus(dynamicData);
      this.statusService.errorCronJob(this.totalError);
      this.statusService.failedCronJob(this.totalFailed);
      this.statusService.successCronJob(this.totalSuccess);
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
              label: "Error",
              data: this.errorCronjobArray,
              backgroundColor: ['#81dee5'],
              borderColor: ['#81dee5']
            },
            {
              label: "Failed",
              data: this.failedCronjobArray,
              backgroundColor: ['#845bf6'],
              borderColor: ['#845bf6']
            },
            {
              label: "Success",
              data: this.successCronjobArray,
              backgroundColor: ['#93d569'],
              borderColor: ['#93d569']
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
