import { OccConfig, OccEndpoint } from '@spartacus/core';

export interface AnalyticsOccEndpoints {
    getOrderData?: string | OccEndpoint;
    getOrderDataWithStatus?: string | OccEndpoint;
    getTicketData?: string | OccEndpoint;
    getTicketDataWithStatus?: string | OccEndpoint;
    getTicketDataWithOrderNo?: string | OccEndpoint;
    getChannelData?: string | OccEndpoint;
    getChannelDataWithStatus?: string | OccEndpoint;
    getUserData?: string | OccEndpoint;
    getUserDataWithStatus?: string | OccEndpoint;
    getOrderDataUsingTicketID?: string | OccEndpoint;
    getOrder?:string|OccEndpoint;
    getCronJobData?:string|OccEndpoint;
    getTicketPrediction?: string | OccEndpoint;
}
export interface statusObject{
    url:String;
    status:number;
  }
declare module '@spartacus/core' {
    interface OccEndpoints extends AnalyticsOccEndpoints { }
}