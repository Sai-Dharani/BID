import { Component, OnDestroy, Input, ChangeDetectorRef, inject } from '@angular/core';
import { ApiService } from '../../../core/facade/interface.service';
import { statusObject } from '../../../occ/models/occ-analytics-endpoints.model';
import { finalize } from 'rxjs/operators';
@Component({
    selector: 'app-interface',
    templateUrl: './interface.component.html',
    styleUrls: ['./interface.component.scss'],
    standalone: false
})

export class InterfaceComponent implements OnDestroy {
  @Input() chartName: any;
  @Input() chartType: any;
  @Input() chartPage: any;
  dataSource: statusObject[] = [];
  apiUrlList: string[] = [
    'biacustomers',
    'biaorders',
    'biatickets',
    'cronjobs',
    'ticketCategories',
    'users'
  ];
  fromDate: any;
  toDate: any;
  rowRefreshing: Record<string, boolean> = {};

  private apiService = inject(ApiService);
  private ChangeDetectorRef = inject(ChangeDetectorRef);

  get isDetailPage(): boolean {
    return this.chartPage === 'detail';
  }

  get visibleData(): statusObject[] {
    return this.isDetailPage ? this.dataSource : this.dataSource.slice(0, 3);
  }

  private get activeApiUrlList(): string[] {
    return this.isDetailPage ? this.apiUrlList : this.apiUrlList.slice(0, 3);
  }

  ngOnInit() {
    this.fetchAllStatuses();
  }

  displayedColumns: string[] = ['url', 'status'];

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private setFallbackDateRange(): void {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    this.fromDate = this.formatDate(lastWeek);
    this.toDate = this.formatDate(today);

    localStorage.setItem('fromDate', this.fromDate);
    localStorage.setItem('toDate', this.toDate);
  }

  private loadDatesFromStorage(): void {
    this.fromDate = localStorage.getItem('fromDate') || '';
    this.toDate = localStorage.getItem('toDate') || '';

    if (!this.hasValidDates()) {
      this.setFallbackDateRange();
    }
  }

  private hasValidDates(): boolean {
    return !!this.fromDate && !!this.toDate && this.fromDate.trim() && this.toDate.trim();
  }

  private initializeRows(): void {
    this.dataSource = this.activeApiUrlList.map((url) => ({ url, status: 0 } as statusObject));
    this.rowRefreshing = {};
  }

  private updateRowStatus(url: string | String, status: number): void {
    const urlValue = String(url);
    const row = this.dataSource.find((item) => String(item.url) === urlValue);
    if (row) {
      row.status = status;
      this.rowRefreshing[urlValue] = false;
    }
    this.ChangeDetectorRef.detectChanges();
  }

  fetchAllStatuses() {
    this.loadDatesFromStorage();

    this.initializeRows();
    for (const url of this.activeApiUrlList) {
      this.fetchStatusForUrl(url);
    }
  }

  fetchStatusForUrl(url: string | String): void {
    const urlValue = String(url);
    this.loadDatesFromStorage();

    if (!this.activeApiUrlList.includes(urlValue)) {
      return;
    }

    this.rowRefreshing[urlValue] = true;
    const currentRow = this.dataSource.find((item) => String(item.url) === urlValue);
    const previousStatus = currentRow?.status ?? 0;

    this.apiService.getStatuses(urlValue, this.fromDate, this.toDate).pipe(
      finalize(() => {
        this.rowRefreshing[urlValue] = false;
        this.ChangeDetectorRef.detectChanges();
      })
    ).subscribe(
      () => {
        this.updateRowStatus(urlValue, 200);
      },
      error => {
        const errorStatus = Number(error?.status);
        const resolvedStatus = Number.isFinite(errorStatus) && errorStatus > 0 ? errorStatus : previousStatus;
        this.updateRowStatus(urlValue, resolvedStatus);
        console.error('Error fetching statuses:', error);
      },
    );
  }

  isRowRefreshing(url: string | String): boolean {
    return !!this.rowRefreshing[String(url)];
  }

  getStatusColor(status: number) {
    if (status === 200) {
      return 'status-green';
    }
    if (status === 0) {
      return 'status-pending';
    }
    return 'status-red';
  }

  ngOnDestroy(): void {
    this.rowRefreshing = {};
  }
}
