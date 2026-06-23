import { NgModule } from '@angular/core';
import {
  BaseStorefrontModule
} from '@spartacus/storefront';
import { AnalyticsModule } from './analytics/src/analytics.module';



@NgModule({
  imports: [
    AnalyticsModule
  ],
  exports: [BaseStorefrontModule],
  declarations: [
  ],
  providers: [],
})

export class PSFeatureLibsModule {}