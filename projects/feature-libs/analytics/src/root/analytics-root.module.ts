import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, provideDefaultConfig } from '@spartacus/core';
import { CmsPageGuard } from '@spartacus/storefront';
import { DetailsPageComponent } from '../components';
import { AnalyticsComponent } from '../components/analytics.component';
import { OrderDetailsComponent } from '../components/order-details/order-details.component';
import { analyticsRoutingModule } from './analytics-routing.module';
import { defaultAnalyticsRoutingConfig } from './default-analytics-routing-config';
import { TicketDetailsComponent } from '../components/ticket-details/ticket-details.component';
import { OrderSummaryComponent } from '../components/order-summary/order-summary.component';

/**
 * Exposes the root modules that we need to statically load. Contains page mappings
 */
@NgModule({
  imports: [
    CommonModule,
    analyticsRoutingModule.forRoot(),
    RouterModule.forChild([
      {
        // We can neither omit the path nor set to undefined
        // @ts-ignore
        path: null,
        component: AnalyticsComponent,
        data: {
          cxRoute: 'analytics',
        },
        canActivate: [CmsPageGuard, AuthGuard],
      },
      {
        // We can neither omit the path nor set to undefined
        // @ts-ignore
        path: null,
        component: DetailsPageComponent,
        data: {
          cxRoute: 'details',
        },
        canActivate: [CmsPageGuard, AuthGuard],
      },
      {
        // We can neither omit the path nor set to undefined
        // @ts-ignore
        path: null,
        component: OrderDetailsComponent,
        data: {
          cxRoute: 'orderDetails',
        },
        canActivate: [CmsPageGuard, AuthGuard],
      },
      {
        // We can neither omit the path nor set to undefined
        // @ts-ignore
        path: null,
        component: TicketDetailsComponent,
        data: {
          cxRoute: 'ticketDetails',
        },
        canActivate: [CmsPageGuard, AuthGuard],
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
    ]),
  ],
  providers: [
    provideDefaultConfig(defaultAnalyticsRoutingConfig)
  ]

})
export class AnalyticsRootModule {
  static forRoot(): ModuleWithProviders<AnalyticsRootModule> {
    return {
      ngModule: AnalyticsRootModule,
    };
  }
}
