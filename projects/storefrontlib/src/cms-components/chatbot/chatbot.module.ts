import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot.component';
import { HttpClientModule } from '@angular/common/http';
import {
  CHATBOT_API_CONFIG,
  defaultChatbotApiConfig,
} from './chatbot-api.config';


@NgModule({
  declarations: [ChatbotComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: CHATBOT_API_CONFIG,
      useValue: defaultChatbotApiConfig,
    },
  ],
  exports: [ChatbotComponent] // Export so it can be used in other modules
})
export class ChatbotModule { }
