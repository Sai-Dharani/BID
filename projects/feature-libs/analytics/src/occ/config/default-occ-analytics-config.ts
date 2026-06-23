import { OccConfig } from "@spartacus/core";
import { AnalyticsOccEndpoints } from "../models/occ-analytics-endpoints.model";

const AnalyticsOccEndpoint: AnalyticsOccEndpoints = {
    getOrderData:
        '/biaorders?fields=DEFAULT&fromDate=${fromDate}&toDate=${toDate}&baseSite=${basesite}',
    getOrderDataWithStatus:
        '/biaorders?fields=DEFAULT&fromDate=${fromDate}&statuses=${status}&toDate=${toDate}&baseSite=${basesite}',
    getTicketData:
        '/biatickets?fields=DEFAULT&fromDate=${fromDate}&toDate=${toDate}&baseSite=${basesite}',
    getTicketDataWithStatus:
        '/biatickets?fields=DEFAULT&fromDate=${fromDate}&statuses=${status}&toDate=${toDate}&baseSite=${basesite}',
    getTicketDataWithOrderNo:
        '/biaorders/${orderNumber}/tickets?fields=DEFAULT',
    getTicketPrediction:
        '/biatickets/predict?fromDate=${fromDate}&toDate=${toDate}',
    getChannelData:
        '/biaorders?fields=DEFAULT&fromDate=${fromDate}&graphType=${graphType}&toDate=${toDate}&baseSite=${basesite}',
    getChannelDataWithStatus:
        '/biaorders?fields=DEFAULT&fromDate=${fromDate}&graphType=${graphType}&channel=${status}&toDate=${toDate}&baseSite=${basesite}',
    getUserData:
        '/biacustomers?fields=FULL&baseSite=${basesite}',
    getUserDataWithStatus:
        '/biacustomers?fields=FULL&statuses=${status}&baseSite=${basesite}',
    getOrderDataUsingTicketID:
        '/users/${userId}/tickets/${orderNumber}?fields=FULL',
    getOrder:
        '/biaorders/order/${orderId}?fields=DEFAULT',
    getCronJobData:
        '/cronjobs?fields=DEFAULT&fromDate=${fromDate}&toDate=${toDate}',
};

export const defaultOccAnalyticsConfig: OccConfig = {
    backend: {
        occ: {
            endpoints: {
                ...AnalyticsOccEndpoint,
            },
        },
    },
};

