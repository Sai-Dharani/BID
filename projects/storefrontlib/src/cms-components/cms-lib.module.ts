import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaModule } from '@spartacus/storefront';
import { BannerModule } from './banner';
import { NavigationModule } from './navigation';
import { ChatbotModule } from './chatbot/chatbot.module';

@NgModule({
  imports: [
    CommonModule,
    MediaModule,
    BannerModule,
    NavigationModule,
    ChatbotModule
  ],
})
export class CmsLibModule { }
