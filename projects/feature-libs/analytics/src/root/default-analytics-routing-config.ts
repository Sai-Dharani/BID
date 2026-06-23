import { Routes } from '@angular/router';
import { RoutingConfig } from '@spartacus/core';
import { PageLayoutComponent } from '@spartacus/storefront';

export const defaultAnalyticsRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      analytics: {
        paths: ['analytics']
      },
      details: {
        paths: ['details']
      },
      orderDetails: {
        paths: ['order-details']
      },
      ticketDetails: {
        paths: ['ticketDetails']
      },
      orderSummary: {
        paths: ['orderSummary']
      }
    },
  },
};
