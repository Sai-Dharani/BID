import { InjectionToken } from '@angular/core';

export interface ChatbotApiConfig {
  endpoint: string;
}

export const CHATBOT_API_CONFIG = new InjectionToken<ChatbotApiConfig>(
  'CHATBOT_API_CONFIG'
);

export const defaultChatbotApiConfig: ChatbotApiConfig = {
  endpoint:
    'https://dxc-intelligent-commerce.cfapps.ap21.hana.ondemand.com/admin',
};
