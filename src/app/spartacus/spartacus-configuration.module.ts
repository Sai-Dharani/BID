import { NgModule } from '@angular/core';
import { translationChunksConfig, translationsEn } from "@spartacus/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, provideConfigFactory, SiteContextConfig } from "@spartacus/core";
import { defaultCmsContentProviders, mediaConfig } from "@spartacus/storefront";
import { layoutConfig } from '../../../projects/storefrontlib/src/recipes/config/default-layout-config';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: 'https://api.cmjk76qh7a-eitservic1-d1-public.model-t.cc.commerce.ondemand.com',
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      urlParameters: ['baseSite', 'language', 'currency'],
      baseSite: ['electronics-spa'],
      language: ['en'],
      currency: ['USD'],
    },
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: { en: translationsEn },
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '2211.43'
    }
  })]
})
export class SpartacusConfigurationModule { }
