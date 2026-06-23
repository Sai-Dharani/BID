import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()

export class StatusService {
    private stuckData$ = new BehaviorSubject<any>({});
    selectedstuckData$ = this.stuckData$.asObservable();

    private progressData$ = new BehaviorSubject<any>({});
    selectedprogressData$ = this.progressData$.asObservable();

    private failedData$ = new BehaviorSubject<any>({});
    selectedfailedData$ = this.failedData$.asObservable();

    private completedData$ = new BehaviorSubject<any>({});
    selectedcompletedData$ = this.completedData$.asObservable();

    private cancelledData$ = new BehaviorSubject<any>({});
    selectedcancelledData$ = this.cancelledData$.asObservable();

    private onModalConfirmation$ = new BehaviorSubject<any>({});
    modalConfirmation$ = this.onModalConfirmation$.asObservable();

   //For Ticket dashlet
    private closedData$ = new BehaviorSubject<any>({});
    selectedClosedData$ = this.closedData$.asObservable();

    private openData$ = new BehaviorSubject<any>({});
    selectedOpenData$ = this.openData$.asObservable();

    private newData$ = new BehaviorSubject<any>({});
    selectedNewData$ = this.newData$.asObservable();

    private EnquiryData$ = new BehaviorSubject<number>(0);
    selectedEnquiryData$ = this.EnquiryData$.asObservable();

    private ComplaintData$ = new BehaviorSubject<number>(0);
    selectedComplaintData$ = this.ComplaintData$.asObservable();

    private ProblemData$ = new BehaviorSubject<number>(0);
    selectedProblemData$ = this.ProblemData$.asObservable();

    //For Channel dashlet
    private webData$ = new BehaviorSubject<any>({});
    selectedWebData$ = this.webData$.asObservable();

    private webMobileData$ = new BehaviorSubject<any>({});
    selectedWebMobileData$ = this.webMobileData$.asObservable();

    private callCenterData$ = new BehaviorSubject<any>({});
    selectedCallCenterData$ = this.callCenterData$.asObservable();

    private orderSubStatus$ = new BehaviorSubject<any>([]);
    selectedOrderSubStatus$ = this.orderSubStatus$.asObservable();

    //For CronJob dashlet
    private errorCronJobData$ = new BehaviorSubject<any>({});
    selectedErrorCronJobData$ = this.errorCronJobData$.asObservable();

    private successCronJobData$ = new BehaviorSubject<any>({});
    selectedSuccessCronJobData$ = this.successCronJobData$.asObservable();

    private failedCronJobData$ = new BehaviorSubject<any>({});
    selectedFailedCronJobData$ = this.failedCronJobData$.asObservable();

    //For User dashlet
    private ActiveCountData$ = new BehaviorSubject<number>(0);
    selectedActiveData$ = this.ActiveCountData$.asObservable();

    private InactiveCountData$ = new BehaviorSubject<number>(0);
    selectedInactiveData$ = this.InactiveCountData$.asObservable();

    //For Total Counts
    private orderTotal$ = new BehaviorSubject<number>(0);
    selectedOrderTotal$ = this.orderTotal$.asObservable();

    private ticketTotal$ = new BehaviorSubject<number>(0);
    selectedTicketTotal$ = this.ticketTotal$.asObservable();

    private channelTotal$ = new BehaviorSubject<number>(0);
    selectedChannelTotal$ = this.channelTotal$.asObservable();

    private cronJobTotal$ = new BehaviorSubject<number>(0);
    selectedCronJobTotal$ = this.cronJobTotal$.asObservable();

    private userTotal$ = new BehaviorSubject<number>(0);
    selectedUserTotal$ = this.userTotal$.asObservable();

  //For Order Data
    stuckedOrders(stuck) {
        this.stuckData$.next(stuck);
    }
    progressOrders(progress) {
        this.progressData$.next(progress);
    }
    failedOrders(failed) {
        this.failedData$.next(failed);
    }
    completedOrders(completed) {
        this.completedData$.next(completed);
    }
    cancelledOrders(cancelled) {
        this.cancelledData$.next(cancelled);
    }
    onModalConfirmation(flag){
        this.onModalConfirmation$.next(flag);
    }

    //For Ticket Data
    closedOrders(closed) {
        this.closedData$.next(closed);
    }
    openOrders(open) {
        this.openData$.next(open);
    }
    newOrders(newO) {
        this.newData$.next(newO);
    }
    Enquiries(enquiries) {
        this.EnquiryData$.next(enquiries);
    }
    Complaints(complaints) {
        this.ComplaintData$.next(complaints);
    }
    Problems(problems) {
        this.ProblemData$.next(problems);
    }

    //For Channel Data
    webChannel(web) {
        this.webData$.next(web);
    }
    webMobileChannel(webMobile) {
        this.webMobileData$.next(webMobile);
    }
    callCenterChannel(callCenter) {
        this.callCenterData$.next(callCenter);
    }
    orderSubStatus(orderSubStatus){
        this.orderSubStatus$.next(orderSubStatus);
    }

    //For CronJob Data
    errorCronJob(error) {
        this.errorCronJobData$.next(error);
    }
    successCronJob(success) {
        this.successCronJobData$.next(success);
    }
    failedCronJob(failed) {
        this.failedCronJobData$.next(failed);
    }

    //for User data
    activeUser(active){
        this.ActiveCountData$.next(active);
    }
    inactiveUser(inactive){
        this.InactiveCountData$.next(inactive);
    }

    //for Total Counts
    setOrderTotal(stuck: number, progress: number, completed: number, failed: number, cancelled: number) {
        const total = (stuck || 0) + (progress || 0) + (completed || 0) + (failed || 0) + (cancelled || 0);
        this.orderTotal$.next(total);
    }

    setTicketTotal(closed: number, open: number, newTickets: number) {
        const total = (closed || 0) + (open || 0) + (newTickets || 0);
        this.ticketTotal$.next(total);
    }

    setChannelTotal(web: number, webMobile: number, callCenter: number) {
        const total = (web || 0) + (webMobile || 0) + (callCenter || 0);
        this.channelTotal$.next(total);
    }

    setCronJobTotal(error: number, success: number, failed: number) {
        const total = (error || 0) + (success || 0) + (failed || 0);
        this.cronJobTotal$.next(total);
    }

    setUserTotal(active: number, inactive: number) {
        const total = (active || 0) + (inactive || 0);
        this.userTotal$.next(total);
    }
}