import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  Config,
  provideConfig,
} from '@spartacus/core';
import {
  BaseStorefrontModule
} from '@spartacus/storefront';
import {
 CmsLibModule,
} from '../cms-components';
import { OccModule } from '../occ';


@NgModule({
  imports: [
    BaseStorefrontModule,
    CmsLibModule,
    OccModule,
  ],
  exports: [BaseStorefrontModule, CmsLibModule],
  declarations: [],
  providers: [],
})
export class PSStorefrontModule {
  static withConfig(config?: Config): ModuleWithProviders<PSStorefrontModule> {
    return {
      ngModule: PSStorefrontModule,
      providers: [provideConfig(config)],
    };
  }
}
