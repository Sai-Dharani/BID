import { NgModule } from '@angular/core';
import { BaseStorefrontModule } from "@spartacus/storefront";
import { SpartacusConfigurationModule } from './spartacus-configuration.module';
import { SpartacusFeaturesModule } from './spartacus-features.module';
import { PSFeatureLibsModule } from '../../../projects/feature-libs/feature-libs.module';

@NgModule({
  declarations: [],
  imports: [
    BaseStorefrontModule,
    SpartacusFeaturesModule,
    SpartacusConfigurationModule,
    PSFeatureLibsModule
  ],
  exports: [BaseStorefrontModule]
})
export class SpartacusModule { }
