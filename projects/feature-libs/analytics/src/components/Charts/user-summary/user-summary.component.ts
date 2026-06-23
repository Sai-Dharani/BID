import { Component, OnDestroy, ChangeDetectorRef, Input, OnChanges, OnInit, inject } from '@angular/core';
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
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  standalone: false
})
export class UserSummaryComponent implements OnDestroy, OnInit, OnChanges {
  @Input() chartName: any;
  @Input() chartType: any;
  @Input() chartPage: any;
  chart_name: any;
  result = [];
  labelArray = [];
  days: any;
  chart: any;
  fromDate: any;
  toDate: any;
  chartData: any;
  userActiveArray = [];
  userInactiveArray = [];
  protected subscription = new Subscription();
  totalActiveUsers: any;
  totalInactiveUsers: any;
  graphType = 'channel';

  private datePickerService = inject(DatePickerService);
  private analyticsService = inject(AnalyticsService);
  private statusService = inject(StatusService);
  private calendar = inject(NgbCalendar);
  private customAdapter = inject(CustomAdapter);
  private _cdr = inject(ChangeDetectorRef);
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
            console.log('Active BaseSite in User Summary Component:', basesite);
            this.monthlyOrderSummary(basesite);
          })
      );
    }
  }
  ngOnChanges() {
    setTimeout(() => {
      if (this.days > 0 && this.router.url == '/details') {
        this.subscription.add(
          this.baseSiteStateService.baseSite$
            .pipe(filter(basesite => basesite !== undefined))
            .subscribe(basesite => {
              console.log('Active BaseSite in User Summary Component:', basesite);
              if (basesite === 'All') {
                basesite = '';
              }
              this.subscription.add(this.analyticsService.getUserData(this.fromDate, this.graphType, this.toDate, basesite).subscribe((response) => {
                this.dynamicUserChart(response);
                this._cdr.detectChanges();
              }))
            }))
      }
    }, 200);
  }
  ngAfterViewInit() {
    // For details page initialization
    if (this.router.url == '/details') {
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
      this.fromDate = fromDate;
      this.toDate = tDate;
      this.days = 7;
      setTimeout(() => {
        this.subscription.add(
          this.baseSiteStateService.baseSite$
            .pipe(filter(basesite => basesite !== undefined))
            .subscribe(basesite => {
              console.log('Active BaseSite in User Summary Component:', basesite);
              if (basesite === 'All') {
                basesite = '';
              }
              this.subscription.add(this.analyticsService.getUserData(this.fromDate, this.graphType, this.toDate, basesite).subscribe((response) => {
                this.dynamicUserChart(response);
              }))
            }))
      }, 200);
    }
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
    this.subscription.add(this.analyticsService.getUserData(fromDate, this.graphType, tDate, basesite).subscribe((response) => {
      this.userChart(response);
    }));
  }
  userStatus(chartData) {
    // Clear arrays before processing new data
    this.userActiveArray = [];
    this.userInactiveArray = [];
    
    let data;
    data = chartData.biaCustomerListCountForGraph;
    data.forEach(element => {
      this.userActiveArray.push(element.customerCountList.activeCustomers);
      this.userInactiveArray.push(element.customerCountList.inActiveCustomers);
    })
    this.totalActiveUsers = this.userActiveArray.reduce((acc, cur) => acc + cur, 0);
    this.totalInactiveUsers = this.userInactiveArray.reduce((acc, cur) => acc + cur, 0);
  }
  userChart(monthlyUserData) {
    this.userStatus(monthlyUserData);
    let chartExist = Chart.getChart("user"); // <canvas> id
    if (chartExist != undefined) {
      chartExist.destroy();
    }
    this.chart = new Chart('user', {
      type: 'pie', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ["Active", "Inactive"],
        datasets: [
          {
            label: "User status",
            data: [this.totalActiveUsers, this.totalInactiveUsers],
            backgroundColor: ['#81dee5', '#ffd966'],
            borderColor: "rgba(0,0,255,0.1)",
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
      }
    });
  }
  //For User
  dynamicUserChart(dynamicData) {
    this.result = [];
    this.labelArray = [];
    this.userActiveArray = [];
    this.userInactiveArray = [];
    this.chart_name = this.chartName[0];
    if (this.chart_name == 'Week' || this.chart_name == 'Year' || this.chart_name == 'Date' || this.chart_name == 'Month') {
      this.userStatus(dynamicData);
      this.statusService.activeUser(this.totalActiveUsers);
      this.statusService.inactiveUser(this.totalInactiveUsers);
      let chartExist = Chart.getChart(this.chart_name); // <canvas> id
      if (chartExist != undefined) {
        console.log(chartExist);
        chartExist.destroy();
      }
      this.chart = new Chart(this.chart_name, {
        type: this.chartType, //this denotes tha type of chart
        data: {// values on X-Axis
          labels: ["Active", "Inactive"],
          datasets: [
            {
              data: [this.userActiveArray, this.userInactiveArray],
              backgroundColor: ["#81dee5", "#ffd966"],
              borderColor: ["#81dee5", "#ffd966"],
            }
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
