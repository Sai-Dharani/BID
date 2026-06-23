import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePickerService } from '../../../core';
import { AnalyticsService } from '../../../core/facade/analytics.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    standalone: false
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() chartName: any;
  @Input() chartType: any;
  days: any;
  fromDate: any;
  toDate: any;
  protected subscription = new Subscription();
  currentDashlet: any;
  private DatePickerService = inject(DatePickerService);
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.router.url == '/details') {
      this.subscription.add(this.DatePickerService.selectedProduct$.subscribe((val) => {
        this.days = val;
      }))
      this.subscription.add(this.DatePickerService.selectedFromDate$.subscribe((fromDate) => {
        this.fromDate = fromDate;
      }))
      this.subscription.add(this.DatePickerService.selectedToDate$.subscribe((toDate) => {
        this.toDate = toDate;
      }))
      this.subscription.add(this.analyticsService.currentDashlet$.subscribe((dashlet) => {
        if (JSON.stringify(dashlet) !== '{}') {
          this.currentDashlet = dashlet;
        } else {
          this.currentDashlet = localStorage.getItem("currentDashlet");
        }
      }))
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

