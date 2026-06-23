import { Component, OnDestroy, Input, OnInit, OnChanges, inject } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { filter, Subscription } from 'rxjs';
import { DatePickerService, StatusService } from '../../../core';
import { AnalyticsService } from '../../../core/facade/analytics.service';
import { CustomAdapter } from '../../shared/datepicker/datepicker.component';
import { Router } from '@angular/router';
import { BaseSiteService } from '@spartacus/core';
import { BaseSiteStateService } from '../../basesite/basesite.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  standalone: false
})
export class TicketComponent implements OnDestroy, OnInit, OnChanges {
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
  closedArray = [];
  openArray = [];
  newArray = [];
  protected subscription = new Subscription();
  totalClosed: any;
  totalOpen: any;
  totalNew: any;
  graphType = 'channel';

  private datePickerService = inject(DatePickerService);
  private analyticsService = inject(AnalyticsService);
  private statusService = inject(StatusService);
  private calendar = inject(NgbCalendar);
  private customAdapter = inject(CustomAdapter);
  private router = inject(Router);
  protected baseSiteService = inject(BaseSiteService);
  protected baseSiteStateService = inject(BaseSiteStateService);
  basesite: Subscription;

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
            console.log('Active BaseSite in Ticket Component:', basesite);
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
              console.log('Active BaseSite in Ticket Component:', basesite);
              if (basesite === 'All') {
                basesite = '';
              }
              this.subscription.add(this.analyticsService.getTicketData(this.fromDate, this.toDate, basesite).subscribe((response) => {
                this.dynamicTicketChart(response);
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
    this.subscription.add(this.analyticsService.getTicketData(fromDate, tDate, basesite).subscribe((response) => {
      this.ticketChart(response);
    }));
  }
  ticketStatus(chartData) {
    // Clear arrays before processing new data
    this.closedArray = [];
    this.openArray = [];
    this.newArray = [];
    
    let data;
    data = chartData.biaTicketListCountForGraph;
    data.forEach(element => {
      this.closedArray.push(element.ticketCountList.closedTickets);
      this.openArray.push(element.ticketCountList.openTickets);
      this.newArray.push(element.ticketCountList.inprocessTickets);
    })
    this.totalClosed = this.closedArray.reduce((acc, cur) => acc + cur, 0);
    this.totalOpen = this.openArray.reduce((acc, cur) => acc + cur, 0);
    this.totalNew = this.newArray.reduce((acc, cur) => acc + cur, 0);
  }
  ticketChart(monthlyOrderData) {
    this.ticketStatus(monthlyOrderData);
    let chartExist = Chart.getChart("ticket"); // <canvas> id
    if (chartExist != undefined) {
      chartExist.destroy();
    }
    this.chart = new Chart('ticket', {
      type: 'doughnut', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ["Closed", "Open", "In progress"],
        datasets: [
          {
            label: "Ticket status",
            data: [this.totalClosed, this.totalOpen, this.totalNew],
            backgroundColor: ['#81dee5', '#845bf6', '#93d569'],
          },
        ]
      },
      options: {
        maintainAspectRatio: false,
      }
    })
  }
  //For Ticket
  dynamicTicketChart(dynamicData) {
    this.result = [];
    this.labelArray = [];
    this.closedArray = [];
    this.openArray = [];
    this.newArray = [];
    this.chart_name = this.chartName[0];
    if (this.chart_name == 'Week' || this.chart_name == 'Year' || this.chart_name == 'Date' || this.chart_name == 'Month') {
      let data;
      data = dynamicData.biaTicketListCountForGraph;
      data.forEach(element => {
        this.labelArray.push(element.label);
      })
      this.ticketStatus(dynamicData);
      this.statusService.closedOrders(this.totalClosed);
      this.statusService.openOrders(this.totalOpen);
      this.statusService.newOrders(this.totalNew);
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
              label: "Closed",
              data: this.closedArray,
              backgroundColor: ['#81dee5'],
              borderColor: ['#81dee5']
            },
            {
              label: "Open",
              data: this.openArray,
              backgroundColor: ['#845bf6'],
              borderColor: ['#845bf6']
            },
            {
              label: "New",
              data: this.newArray,
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
