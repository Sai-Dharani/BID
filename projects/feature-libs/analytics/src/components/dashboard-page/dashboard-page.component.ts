import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseSiteService, RoutingService } from '@spartacus/core';
import { AnalyticsService } from '../../core';
import { Subscription, combineLatest } from 'rxjs';
import { catchError, filter, finalize, map, take } from 'rxjs/operators';
import { BaseSiteStateService } from '../basesite/basesite.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
    showPredictionTooltip = false;
    ticketPrediction: any = null;
    isPredictionLoading = false;
    currentFromDate = '';
    currentToDate = '';

    onPredictTicket() {
      this.isPredictionLoading = true;
      this.showPredictionTooltip = false;
      this.ticketPrediction = null;

      const fromDate = this.currentFromDate;
      const toDate = this.currentToDate;

      if (!fromDate || !toDate) {
        this.isPredictionLoading = false;
        return;
      }

      this.analyticsServices
        .getTicketPrediction(fromDate, toDate)
        .pipe(
          take(1),
          catchError(() => {
            this.showPredictionTooltip = false;
            return [];
          }),
          finalize(() => {
            this.isPredictionLoading = false;
          })
        )
        .subscribe(result => {
          this.ticketPrediction = result;
          this.showPredictionTooltip = true;
        });
    }

    closePredictionTooltip() {
      this.showPredictionTooltip = false;
    }

    formatTicketCount(value: any): string {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '-';
    }
  // Dashboard constants
  orderSummary = 'orderSummary';
  cronJob = 'cronJob';
  channel = 'channel';
  ticket = 'ticket';
  user = 'user';
  userReg = 'userReg';
  interface = 'interface';
  weekChart = 'weekChart';

  // Tab management
  activeTab: string = 'SAP Commerce';
  tabs: string[] = ['SAP Commerce', 'SAP Service Cloud', 'SAP Sales Cloud', 'SAP S4 HANA'];

  // SSR-safe date
  dateToday!: number;
  baseSites: string[] = [];
  filteredBaseSites: string[] = [];
  open = false;
  selected: string | null = null;
  searchText = '';
  readonly ALL_OPTION = 'All';

  protected subscription = new Subscription();
  protected routingService = inject(RoutingService);
  protected analyticsServices = inject(AnalyticsService);
  protected baseSiteService = inject(BaseSiteService);
  protected baseSiteStateService = inject(BaseSiteStateService);


  // Combined observable for template (IMPORTANT)
  dateRange$ = combineLatest([
    this.analyticsServices.defaultFromDate$,
    this.analyticsServices.currentToDate$
  ]).pipe(
    filter(([from, to]) => !!from && !!to), // prevents null async errors
    map(([from, to]) => ({ from, to }))
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Browser-only logic
    if (isPlatformBrowser(this.platformId)) {
      this.dateToday = Date.now();

      // Avoid jQuery; keep DOM-safe
      const greetEl = document.querySelector('div.cx-login-greet');
      if (greetEl) {
        greetEl.innerHTML = 'Hi, Admin';
      }
    }
    this.subscription.add(
      this.baseSiteStateService.baseSite$
        .pipe(filter(basesite => basesite !== undefined))
        .subscribe(basesite => {
          this.selected = basesite;
          console.log('Selected BaseSite in Dashboard Component:', this.selected);
        }));

    this.subscription.add(
      combineLatest([
        this.analyticsServices.defaultFromDate$,
        this.analyticsServices.currentToDate$
      ])
      .subscribe(([fromDate, toDate]) => {
        this.currentFromDate = typeof fromDate === 'string' ? fromDate : '';
        this.currentToDate = typeof toDate === 'string' ? toDate : '';
      })
    );
  }


  /** Switch between tabs */
  selectTab(tab: string): void {
    this.activeTab = tab;
    this.analyticsServices.setActiveTab(tab);
  }

  /** Navigate to details page with selected dashlet */
  routeTo(dashlet: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('fromDate', '');
      localStorage.setItem('toDate', '');
      localStorage.setItem('currentDashlet', dashlet);
    }

    this.analyticsServices.setCurrentDashlet(dashlet);
    this.routingService.go({ cxRoute: 'details' });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
