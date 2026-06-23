import { Component, OnDestroy, Input, OnInit, OnChanges, inject } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { DatePickerService } from '../../../core';
import { AnalyticsService } from '../../../core/facade/analytics.service';
import { CustomAdapter } from '../../shared/datepicker/datepicker.component';
import { Router } from '@angular/router';
import { BaseSiteStateService } from '../../basesite/basesite.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  standalone: false
})
export class UserRegistrationComponent implements OnDestroy, OnInit, OnChanges {
  @Input() chartName: any;
  @Input() chartType: any;
  @Input() chartPage: any;
  result = [];
  labelArray = [];
  days: any;
  chart: any;
  fromDate: any;
  toDate: any;
  chartData: any;
  userActiveArray = [];
  userInactiveArray = [];
  chart_name: any;
  protected subscription = new Subscription();
  totalActiveUsers: any;
  totalInactiveUsers: any;
  graphType = 'channel';

  private datePickerService = inject(DatePickerService);
  private analyticsService = inject(AnalyticsService);
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
            console.log('Active BaseSite in User Registration Component:', basesite);
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
              console.log('Active BaseSite in User Registration Component:', basesite);
              if (basesite === 'All') {
                basesite = '';
              }
              this.subscription.add(
                this.baseSiteStateService.baseSite$
                  .pipe(filter(basesite => basesite !== undefined))
                  .subscribe(basesite => {
                    console.log('Active BaseSite in User Registration Component:', basesite);
                    if (basesite === 'All') {
                      basesite = '';
                    }
                    this.subscription.add(this.analyticsService.getUserData(this.fromDate, this.graphType, this.toDate, basesite).subscribe((response) => {
                    }))
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
    this.subscription.add(this.analyticsService.getUserData(fromDate, this.graphType, tDate, basesite).subscribe((response) => {
      this.userRegChart(response);
    }));
  }
  userRegChart(monthlyUserData) {
    this.userStatus(monthlyUserData);
    let chartExist = Chart.getChart("userReg"); // <canvas> id
    if (chartExist != undefined) {
      chartExist.destroy();
    }
    this.chart = new Chart('userReg', {
      type: 'bar', //this denotes tha type of chart
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        maintainAspectRatio: false
      },
      data: {// values on X-Axis
        labels: ['Registered Users'],
        datasets: [
          {
            label: "User registration status",
            data: [this.totalActiveUsers],
            backgroundColor: ['#81dee5'],
            borderColor: "rgba(0,0,255,0.1)",
            barPercentage: 0.5,
            barThickness: 35,
          },
        ]
      }
    });
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
