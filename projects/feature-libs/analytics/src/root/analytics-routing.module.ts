import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  provideDefaultConfig,
  RoutingModule as CoreRoutingModule,
} from '@spartacus/core';
import { CmsRouteModule } from '@spartacus/storefront';
import { defaultAnalyticsRoutingConfig } from './default-analytics-routing-config';

/**
 * Provides the default cx routing configuration for the textfield configurator
 */
@NgModule({
  imports: [CoreRoutingModule.forRoot(), CmsRouteModule],
})
export class analyticsRoutingModule {
  static forRoot(): ModuleWithProviders<analyticsRoutingModule> {
    return {
      ngModule: analyticsRoutingModule,
      providers: [provideDefaultConfig(defaultAnalyticsRoutingConfig)],
    };
  }
}
