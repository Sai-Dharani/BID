import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { FooterNavigationComponent } from './footer-navigation.component';

@NgModule({
  declarations: [FooterNavigationComponent],
  imports: [
    CommonModule
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        PSFooterComponent: {
          component: FooterNavigationComponent,
        },
      },
    }),
  ],
})
export class FooterNavigationModule {}
