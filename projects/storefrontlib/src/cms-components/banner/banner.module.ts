import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule, CmsConfig, I18nModule } from '@spartacus/core';
import { BannerComponent, MediaModule } from '@spartacus/storefront';
import { PSEnhancedBannerComponent } from './enhanced-banner/enhanced-banner.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    MediaModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        PSSimpleResponsiveBannerComponent: {
          component: BannerComponent,
        },
        PSSimpleBannerComponent: {
          component: BannerComponent
        },
        PSBannerComponent: {
          component: BannerComponent
        },
        PSEnhancedBannerComponent: {
          component: PSEnhancedBannerComponent
        },
      },
    }),
  ],
  declarations: [
    PSEnhancedBannerComponent
  ],
})
export class BannerModule {}
