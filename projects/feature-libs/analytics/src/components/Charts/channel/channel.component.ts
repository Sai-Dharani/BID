import { Component, OnDestroy, Input, OnInit, OnChanges, inject } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DatePickerService, StatusService } from '../../../core';
import { AnalyticsService } from '../../../core/facade/analytics.service';
import { CustomAdapter } from '../../shared/datepicker/datepicker.component';
import { Router } from '@angular/router';
import { BaseSiteStateService } from '../../basesite/basesite.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  standalone: false
})
export class ChannelComponent implements OnDestroy, OnInit, OnChanges {
  @Input() chartName: any;
  @Input() chartType: any;
  @Input() chartPage: any;
  result = [];
  labelArray = [];
  days: any;
  chart_name: any;
  chart: any;
  fromDate: any;
  toDate: any;
  chartData: any;
  webArray = [];
  webMobileArray = [];
  callCenterArray = [];
  protected subscription = new Subscription();
  totalWeb: any;
  totalWebMobile: any;
  totalCallCenter: any;
  graphType = 'channel';

  private datePickerService = inject(DatePickerService);
  private analyticsService = inject(AnalyticsService);
  private statusService = inject(StatusService);
  private calendar = inject(NgbCalendar);
  private customAdapter = inject(CustomAdapter);
  private router = inject(Router);
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
            console.log('Active BaseSite in Channel Component:', basesite);
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
              console.log('Active BaseSite in Channel Component:', basesite);
              if (basesite === 'All') {
                basesite = '';
              }
              this.subscription.add(this.analyticsService.getChannelData(this.fromDate, this.graphType, this.toDate, basesite).subscribe((response) => {
                this.dynamicChannelChart(response);
              }))
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
    this.subscription.add(this.analyticsService.getChannelData(fromDate, this.graphType, tDate, basesite).subscribe((response) => {
      this.channelChart(response);
    }));
  }
  channelChart(monthlyCronJobData) {
    this.channelStatus(monthlyCronJobData);
    let chartExist = Chart.getChart("channel"); // <canvas> id
    if (chartExist != undefined) {
      chartExist.destroy();
    }
    this.chart = new Chart('channel', {
      type: 'pie', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ["Web Desktop", "Web Mobile", "Call Center"],
        datasets: [
          {
            label: "channel status",
            data: [this.totalWeb, this.totalWebMobile, this.totalCallCenter],
            backgroundColor: ['#93d569', '#ec635d', '#ffd966'],
            borderColor: "rgba(0,0,255,0.1)",
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
      }
    });
  }
  channelStatus(chartData) {
    // Clear arrays before processing new data
    this.webArray = [];
    this.webMobileArray = [];
    this.callCenterArray = [];
    
    let data;
    data = chartData.biaOrderListCountForGraph;
    data.forEach(element => {
      this.webArray.push(element.orderCountListForChannel.web);
      this.webMobileArray.push(element.orderCountListForChannel.webMobile);
      this.callCenterArray.push(element.orderCountListForChannel.callCenter);
    })
    this.totalWeb = this.webArray.reduce((acc, cur) => acc + cur, 0);
    this.totalWebMobile = this.webMobileArray.reduce((acc, cur) => acc + cur, 0);
    this.totalCallCenter = this.callCenterArray.reduce((acc, cur) => acc + cur, 0);
  }
  //For Channel
  dynamicChannelChart(dynamicData) {
    this.result = [];
    this.labelArray = [];
    this.webArray = [];
    this.webMobileArray = [];
    this.callCenterArray = [];
    this.chart_name = this.chartName[0];
    if (this.chart_name == 'Week' || this.chart_name == 'Year' || this.chart_name == 'Date' || this.chart_name == 'Month') {
      let data;
      data = dynamicData.biaOrderListCountForGraph;
      data.forEach(element => {
        this.labelArray.push(element.label);
      })
      this.channelStatus(dynamicData);
      this.statusService.webChannel(this.totalWeb);
      this.statusService.webMobileChannel(this.totalWebMobile);
      this.statusService.callCenterChannel(this.totalCallCenter);
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
              label: "Web",
              data: this.webArray,
              backgroundColor: ['#93d569'],
              borderColor: ['#93d569']
            },
            {
              label: "Web Mobile",
              data: this.webMobileArray,
              backgroundColor: ['#ec635d'],
              borderColor: ['#ec635d']
            },
            {
              label: "Call Center",
              data: this.callCenterArray,
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
