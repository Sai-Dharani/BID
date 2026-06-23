import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CHATBOT_API_CONFIG, ChatbotApiConfig } from './chatbot-api.config';

@Injectable({
  providedIn: 'root',
})
export class ChatbotApiService {
  private readonly authStorageKey = 'spartacus⚿⚿auth';

  constructor(
    private http: HttpClient,
    @Inject(CHATBOT_API_CONFIG) private config: ChatbotApiConfig
  ) {}

  sendMessage(
    query: string,
    conversationId: string | null
  ): Observable<HttpResponse<string>> {
    return this.http.get(this.config.endpoint, {
      params: this.buildQueryParams(query),
      headers: this.buildHeaders(conversationId),
      observe: 'response',
      responseType: 'text',
    });
  }

  private buildQueryParams(query: string): HttpParams {
    return new HttpParams().set('query', query);
  }

  private buildHeaders(conversationId: string | null): HttpHeaders {
    let headers = new HttpHeaders();
    const accessToken = this.getAccessToken();

    if (accessToken) {
      headers = headers.set('commerceAuthToken', accessToken);
    }

    if (conversationId) {
      headers = headers.set('X-Conversation-Id', conversationId);
    }

    return headers;
  }

  private getAccessToken(): string {
    const directAuthToken = this.findAccessToken(
      localStorage.getItem(this.authStorageKey)
    );
    if (directAuthToken) {
      return directAuthToken;
    }

    return (
      this.findAccessTokenInStorage(localStorage) ||
      this.findAccessTokenInStorage(sessionStorage)
    );
  }

  private findAccessToken(value: unknown): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        return '';
      }

      try {
        const parsed = JSON.parse(trimmedValue);
        return this.findAccessToken(parsed);
      } catch {
        return this.isLikelyJwt(trimmedValue) ? trimmedValue : '';
      }
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const token = this.findAccessToken(item);
        if (token) {
          return token;
        }
      }
      return '';
    }

    if (typeof value !== 'object') {
      return '';
    }

    const record = value as Record<string, unknown>;
    const candidateKeys = ['access_token', 'accessToken', 'token'];

    for (const key of candidateKeys) {
      const token = this.findAccessToken(record[key]);
      if (token) {
        return token;
      }
    }

    for (const nestedValue of Object.values(record)) {
      const token = this.findAccessToken(nestedValue);
      if (token) {
        return token;
      }
    }

    return '';
  }

  private findAccessTokenInStorage(storage: Storage): string {
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (!key) {
        continue;
      }

      const token = this.findAccessToken(storage.getItem(key));
      if (token) {
        return token;
      }
    }

    return '';
  }

  private isLikelyJwt(value: string): boolean {
    return /^[-A-Za-z0-9_=]+\.[-A-Za-z0-9_=]+\.?[-A-Za-z0-9_.+/=]*$/.test(value);
  }
}
