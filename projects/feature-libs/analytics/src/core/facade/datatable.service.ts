import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()

export class DataTableService {
    private orderStatus$ = new BehaviorSubject<any>({});
    selectedorderStatus$ = this.orderStatus$.asObservable();

    private orderTotal$ = new BehaviorSubject<any>({});
    selectedorderTotal$ = this.orderTotal$.asObservable();

    private ticketStatus$ = new BehaviorSubject<any>({});
    selectedTicketStatus$ = this.ticketStatus$.asObservable();

    private ticketTotal$ = new BehaviorSubject<any>({});
    selectedTicketTotal$ = this.ticketTotal$.asObservable();

    private channelStatus$ = new BehaviorSubject<any>({});
    selectedChannelStatus$ = this.channelStatus$.asObservable();

    private channelTotal$ = new BehaviorSubject<any>({});
    selectedChannelTotal$ = this.channelTotal$.asObservable();

    private cronJobStatus$ = new BehaviorSubject<any>({});
    selectedCronJobStatus$ = this.cronJobStatus$.asObservable();

    private cronJobTotal$ = new BehaviorSubject<any>({});
    selectedCronJobTotal$ = this.cronJobTotal$.asObservable();

    private userStatus$ = new BehaviorSubject<any>({});
    selectedUserStatus$ = this.userStatus$.asObservable();

    private userTotal$ = new BehaviorSubject<any>({});
    selectedUserTotal$ = this.userTotal$.asObservable();

    private tableData$ = new BehaviorSubject<any>({});
    selectedtableData$ = this.tableData$.asObservable();

    // Private BehaviorSubject to hold the table data state
    private currentTableData$ = new BehaviorSubject<any>([]);

    // Public observable to expose table data as a stream
    selectedTableData$: Observable<any> = this.currentTableData$.asObservable();

    //for Order
    setorderStatus(orderStatus) {
        this.orderStatus$.next(orderStatus);
    }
    setOrderTotal(orderTotal) {
        this.orderTotal$.next(orderTotal);
    }

    //for ticket
    setTicketStatus(ticketStatus) {
        this.ticketStatus$.next(ticketStatus);
    }
    setTicketTotal(ticketTotal) {
        this.ticketTotal$.next(ticketTotal);
    }

    //for channel
    setChannelStatus(channelStatus) {
        this.channelStatus$.next(channelStatus);
    }
    setChannelTotal(channelTotal) {
        this.channelTotal$.next(channelTotal);
    }

    //for cronjob
    setCronJobStatus(cronJobStatus) {
        this.cronJobStatus$.next(cronJobStatus);
    }
    setCronJobTotal(cronJobTotal) {
        this.cronJobTotal$.next(cronJobTotal);
    }

    //for user
    setUserStatus(userTotal) {
        this.userStatus$.next(userTotal);
    }
    setUsertotal(userTotal) {
        this.userTotal$.next(userTotal);
    }

    //for Table data
    setTableData(tableData) {
        this.tableData$.next(tableData);
    }

    // Method to update the table data
    setCurrentTableData(tableData: any): void {
        console.log('[DataTableService] setCurrentTableData called with:', tableData);
        console.log('[DataTableService] Data length:', Array.isArray(tableData) ? tableData.length : 'Not an array');
        this.currentTableData$.next(tableData);
    }

    // Method to get the current value of table data as an observable
    getCurrentTableData(): Observable<any> {
        return this.selectedTableData$;
    }
}