import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { DisclaimerService } from './disclaimer.service';

@Component({
  selector: 'app-disclaimer-popup',
  templateUrl: './disclaimer-popup.component.html',
  styleUrls: ['./disclaimer-popup.component.scss'],
  standalone: true
})
export class DisclaimerPopupComponent implements OnInit, OnDestroy {
  show = false;
  private sub?: Subscription;

  constructor(
    private readonly disclaimerService: DisclaimerService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    // Handle initial URL
    this.checkForHome(this.router.url);

    // React to route changes
    this.sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        this.checkForHome(url);
      });
  }

  private checkForHome(url: string): void {
    const cleanUrl = url.split('?')[0];
    const segments = cleanUrl.split('/').filter(Boolean);
    const lastSegment = segments.at(-1) ?? '';
    const isRoot = segments.length === 0;
    const isBaseLangCurr =
      segments.length === 3 &&
      segments[1].length === 2 &&
      segments[2].length === 3;
    const isLogin = lastSegment.toLowerCase() === 'login';

    const isHome = isRoot || isBaseLangCurr;

    if (isHome || isLogin) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  acknowledge(): void {
    this.disclaimerService.accept();
    this.show = false;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
