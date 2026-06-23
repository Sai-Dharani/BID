import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';
import { PageSlotModule, PageLayoutModule} from "@spartacus/storefront";
import { HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisclaimerModule } from './disclaimer/disclaimer.module';
import { CommonModule } from '@angular/common';
import { DisclaimerPopupComponent } from './disclaimer/disclaimer-popup.component';
import { AuthService, I18nModule, provideConfig, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AnalyticsRootModule, AnalyticsService, DataTableService, DatePickerService, defaultAnalyticsRoutingConfig, ExcelService, StatusService } from '../../projects/feature-libs/analytics';
import { LogoutConfirmComponent } from './logout-confirm.component';
import { ChatbotModule } from '../../projects/storefrontlib/src/cms-components/chatbot/chatbot.module';
import { CHATBOT_API_CONFIG, defaultChatbotApiConfig } from '../../projects/storefrontlib/src/cms-components/chatbot/chatbot-api.config';
import { CustomAdapter } from '../../projects/feature-libs/analytics/src/components/shared/datepicker/datepicker.component';
import { defaultOccAnalyticsConfig } from '../../projects/feature-libs/analytics/src/occ/config';
import { DashletsComponentModule } from '../../projects/feature-libs/analytics/src/components/dashlets/dashlets.module';
import { commonModalConfig } from '../../projects/feature-libs/analytics/src/common-modal.config';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LogoutConfirmComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SpartacusModule,
    NgbModule,
    PageSlotModule,
    PageLayoutModule,
    ChatbotModule,
    // NgxPaginationModule,
    BrowserAnimationsModule,
    FormsModule,
    UrlModule,
    I18nModule,
    ReactiveFormsModule,
    DisclaimerModule,
    DisclaimerPopupComponent,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
