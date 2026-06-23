import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthGuard, CmsConfig, I18nModule, UrlModule, provideConfig } from "@spartacus/core";
import { AnalyticsComponent } from "./analytics.component";
import { DataTableComponent } from "./data-table/data-table.component";
import { DetailsPageComponent } from "./details-page/details-page.component";
import { ChartComponent } from "./dashboard-page/chart/chart.component";
import { DashboardComponent } from "./dashboard-page/dashboard-page.component";
import { NgbdDatepickerAdapter } from "./shared/datepicker/datepicker.component";
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';
import { commonModalConfig } from "../common-modal.config";
import { IconModule, SpinnerModule } from "@spartacus/storefront";
import { TicketDetailsComponent } from "./ticket-details/ticket-details.component";
import { SideNavComponent } from "./sideNav/sideNav.component";
import { RouterLink } from "@angular/router";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";
import { DashletsComponentModule } from "./dashlets/dashlets.module";
import { ChartsModule } from "./Charts/charts.module";
import { PDFComponent } from "./pdf/pdf.component";
import { BasesiteComponent } from "./basesite/basesite.component";

@NgModule({
    imports: [
        CommonModule,
        NgbDatepickerModule,
        FormsModule,
        SpinnerModule,
        RouterLink,
        UrlModule,
        DashletsComponentModule,
        ChartsModule,
        IconModule,
        I18nModule
    ],
    declarations: [
        DashboardComponent,
        ChartComponent,
        DetailsPageComponent,
        DataTableComponent,
        NgbdDatepickerAdapter,
        AnalyticsComponent,
        OrderDetailsComponent,
        ConfirmationModalComponent,
        TicketDetailsComponent,
        SideNavComponent,
        OrderSummaryComponent,
        PDFComponent,
        BasesiteComponent
      ],
      providers: [
        provideConfig(<CmsConfig>{
          cmsComponents: {
            AnalyticsComponent: {
              component: AnalyticsComponent,
              guards: [AuthGuard]
            },
            DetailsComponent: {
              component: DetailsPageComponent,
            },
            OrderDetailsComponent: {
              component: OrderDetailsComponent,
            },
            TicketDetailsComponent:{
              component:TicketDetailsComponent
            },
            OrderSummaryComponent:{
              component:OrderSummaryComponent
            }
          },
        }),
        provideConfig(commonModalConfig),
        
      ],
      exports: [
        AnalyticsComponent,
        DetailsPageComponent,
        OrderDetailsComponent,
        TicketDetailsComponent,
        SideNavComponent,
        OrderSummaryComponent,
        PDFComponent,
        BasesiteComponent
      ],
  })
  export class AnalyticsComponentModule { }