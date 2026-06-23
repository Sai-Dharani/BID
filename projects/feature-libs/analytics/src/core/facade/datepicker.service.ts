import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()

export class DatePickerService {
    numberOfDays: any;
    private days$ = new BehaviorSubject<any>({});
    selectedProduct$ = this.days$.asObservable();

    private filterFromDate$ = new BehaviorSubject<any>({});
    selectedFromDate$ = this.filterFromDate$.asObservable();

    private filterToDate$ = new BehaviorSubject<any>({});
    selectedToDate$ = this.filterToDate$.asObservable();

    private resetDates$ = new BehaviorSubject<boolean>(false);
    shouldResetDates$ = this.resetDates$.asObservable();

    private http = inject(HttpClient);

    ngOnInit() {
    }

    setDays(numberOfDays) {
        this.numberOfDays = numberOfDays;
        this.days$.next(numberOfDays);
    }

    getFilterDates(fromDate, toDate) {
        this.filterFromDate$.next(fromDate);
        this.filterToDate$.next(toDate);
    }

    resetDates() {
        this.filterFromDate$.next(null);
        this.filterToDate$.next(null);
        this.days$.next(0);
        this.resetDates$.next(true);
    }

    getApi() {
        const API_URL = 'https://localhost:9002/poll?chartId=memoryChart&timePeriod=300000&utcOffset=-19800000&_=1679654736206';
        return this.http.get(API_URL).pipe(map(res => console.log(res)));
    }
}