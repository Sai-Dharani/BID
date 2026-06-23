import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DisclaimerService {
  private readonly STORAGE_KEY = 'disclaimerAccepted';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  hasAccepted(): boolean {
    if (!this.isBrowser()) {
      return false;
    }
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  accept(): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }
}
