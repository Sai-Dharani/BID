import { Routes } from '@angular/router';
import { AnalyticsComponent } from '../../projects/feature-libs/analytics/src/components/analytics.component';
import { AuthGuard } from '@spartacus/core';
import { DetailsPageComponent } from '../../projects/feature-libs/analytics';
import { OrderSummaryComponent } from '../../projects/feature-libs/analytics/src/components/order-summary/order-summary.component';
import { CmsPageGuard } from '@spartacus/storefront';

export const BIARoutes: Routes = [
  {
    path: 'analytics',  // Changed from '' to 'analytics'
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Analytics Page - Angular reusable components',
      description: 'Welcome to the analytics page of the application',
    },
  },
  {
    path: 'details',
    component: DetailsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    // We can neither omit the path nor set to undefined
    // @ts-ignore
    path: null,
    component: OrderSummaryComponent,
    data: {
      cxRoute: 'orderSummary',
    },
    canActivate: [CmsPageGuard, AuthGuard],
  }
];

export const routes: Routes = [
  {path:'', component: AnalyticsComponent, pathMatch: 'full'},
  ...BIARoutes  // Spread the BIARoutes into the main routes array
];
