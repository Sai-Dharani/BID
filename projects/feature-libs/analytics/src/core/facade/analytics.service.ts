import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { OccEndpointsService, UserIdService } from "@spartacus/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()

export class AnalyticsService {

    private filterFromDate$ = new BehaviorSubject<any>({});
    defaultFromDate$ = this.filterFromDate$.asObservable();

    private filterToDate$ = new BehaviorSubject<any>({});
    currentToDate$ = this.filterToDate$.asObservable();

    private dashlet$ = new BehaviorSubject<any>({});
    currentDashlet$ = this.dashlet$.asObservable();

    private activeTab$ = new BehaviorSubject<string>('SAP Commerce');
    currentActiveTab$ = this.activeTab$.asObservable();

    private ticketPrediction$ = new BehaviorSubject<any>(null);
    currentTicketPrediction$ = this.ticketPrediction$.asObservable();

    private httpclient = inject(HttpClient);
    protected occEndpoints = inject(OccEndpointsService);
    protected userIdService = inject(UserIdService);

    getdashboardPageDates(fromDate, toDate) {
        this.filterFromDate$.next(fromDate);
        this.filterToDate$.next(toDate);
    }

    setCurrentDashlet(dashlet) {
        this.dashlet$.next(dashlet);
    }

    setActiveTab(tab: string) {
        this.activeTab$.next(tab);
    }

    setTicketPrediction(prediction: any) {
        this.ticketPrediction$.next(prediction);
    }

    getOrderData(fromDate: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getOrderDataEndPoint(fromDate, toDate, basesite));
    }

    protected getOrderDataEndPoint(fromDate: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getOrderData', {
            urlParams: { fromDate, toDate, basesite }
        });
    }

    getOrderDataWithStatus(fromDate: string, status: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getOrderDataWithStatusEndPoint(fromDate, status, toDate, basesite));
    }

    protected getOrderDataWithStatusEndPoint(fromDate: string, status: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getOrderDataWithStatus', {
            urlParams: { fromDate, status, toDate, basesite }
        });
    }

    getTicketData(fromDate: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getTicketDataEndPoint(fromDate, toDate, basesite));
    }

    protected getTicketDataEndPoint(fromDate: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getTicketData', {
            urlParams: { fromDate, toDate, basesite }
        });
    }

    getTicketDataWithStatus(fromDate: string, status: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getTicketDataWithStatusEndPoint(fromDate, status, toDate, basesite));
    }

    protected getTicketDataWithStatusEndPoint(fromDate: string, status: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getTicketDataWithStatus', {
            urlParams: { fromDate, status, toDate, basesite }
        });
    }

    getTicketDataWithOrderNo(orderNumber: string): Observable<any> {
        return this.httpclient.get(this.getTicketDataWithOrderNoEndPoint(orderNumber));
    }

    protected getTicketDataWithOrderNoEndPoint(orderNumber: string): string {
        return this.occEndpoints.buildUrl('getTicketDataWithOrderNo', {
            urlParams: { orderNumber }
        });
    }

    getChannelData(fromDate: string, graphType: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getChannelDataEndPoint(fromDate, graphType, toDate, basesite));
    }

    protected getChannelDataEndPoint(fromDate: string, graphType: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getChannelData', {
            urlParams: { fromDate, graphType, toDate, basesite }
        });
    }

    getChannelDataWithStatus(fromDate: string, graphType: string, status: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getChannelDataWithStatusEndPoint(fromDate, graphType, status, toDate, basesite));
    }

    protected getChannelDataWithStatusEndPoint(fromDate: string, graphType: string, status: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getChannelDataWithStatus', {
            urlParams: { fromDate, graphType, status, toDate, basesite }
        });
    }
    getUserData(fromDate: string, graphType: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getuserDataEndpoint(fromDate, graphType, toDate, basesite));
    }
    protected getuserDataEndpoint(fromDate: string, graphType: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getUserData', {
            urlParams: { fromDate, graphType, toDate, basesite }
        });
    }
    getUserDataWithStatus(fromDate: string, graphType: string, status: string, toDate: string, basesite: string): Observable<any> {
        return this.httpclient.get(this.getUserDataWithStatusEndpoint(fromDate, graphType, status, toDate, basesite));
    }
    protected getUserDataWithStatusEndpoint(fromDate: string, graphType: string, status: string, toDate: string, basesite: string): string {
        return this.occEndpoints.buildUrl('getUserDataWithStatus', {
            urlParams: { fromDate, graphType, status, toDate, basesite }
        });
    }


    getOrderDataUsingTicketID(userId: string, orderNumber: string): Observable<any> {
        return this.httpclient.get(this.getOrderDataUsingTicketIDNoEndPoint(userId, orderNumber))
    }

    protected getOrderDataUsingTicketIDNoEndPoint(userId: string, orderNumber: string): string {
        return this.occEndpoints.buildUrl('getOrderDataUsingTicketID', {
            urlParams: { userId, orderNumber }
        });
    }
    getOrder(orderId: string): Observable<any> {
        return this.httpclient.get(this.getOrderEndPoint(orderId))
    }

    protected getOrderEndPoint(orderId: string): string {
        return this.occEndpoints.buildUrl('getOrder', {
            urlParams: { orderId }
        });
    }

    getCronJob(fromDate: string, toDate: string): Observable<any> {
        return this.httpclient.get(this.getCronJobEndPoint(fromDate, toDate))
    }

    protected getCronJobEndPoint(fromDate: string, toDate: string): string {
        return this.occEndpoints.buildUrl('getCronJobData', {
            urlParams: { fromDate, toDate }
        });
    }


    /**
     * Calls the prediction API for tickets between fromDate and toDate.
     * Returns observable with prediction result.
     */
    getTicketPrediction(fromDate: string, toDate: string): Observable<any> {
        return this.httpclient.get(this.getTicketPredictionEndPoint(fromDate, toDate));
    }

    protected getTicketPredictionEndPoint(fromDate: string, toDate: string): string {
        return this.occEndpoints.buildUrl('getTicketPrediction', {
            urlParams: { fromDate, toDate }
        });
    }
}