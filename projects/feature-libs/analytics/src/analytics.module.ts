import { NgModule } from "@angular/core";
import { provideDefaultConfig } from "@spartacus/core";
import { AnalyticsComponentModule } from "./components/analytics-component.module";
import { CustomAdapter, CustomDateParserFormatter } from "./components/shared/datepicker/datepicker.component";
import { DataTableService, DatePickerService, ExcelService, StatusService } from "./core/facade";
import { AnalyticsService } from "./core/facade/analytics.service";
import { AnalyticsOccModule } from "./occ";
import { analyticsRoutingModule, defaultAnalyticsRoutingConfig } from "./root";
import { DatePipe } from "@angular/common";
import { BaseSiteStateService } from "./components/basesite/basesite.service";


@NgModule({
  imports: [
    AnalyticsComponentModule,
    analyticsRoutingModule,
    AnalyticsOccModule,
  ],
  providers: [DatePickerService, DataTableService, AnalyticsService, StatusService, BaseSiteStateService, ExcelService,
    CustomDateParserFormatter, CustomAdapter, DatePipe,
    provideDefaultConfig(defaultAnalyticsRoutingConfig),
  ],
})
export class AnalyticsModule { }