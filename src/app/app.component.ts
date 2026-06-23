import { ChangeDetectorRef, Component, OnInit, inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService, User, AuthService } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatePickerService } from '../../projects/feature-libs/analytics/src/core/facade/datepicker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  public chart: any;
  pageUrl: any;
  title = 'BIA';
  user$: Observable<User | undefined>;
  showLogoutPopup = false;

  private authService = inject(AuthService);
  private routingService = inject(RoutingService);
  private datePickerService = inject(DatePickerService);
  private userAccount = inject(UserAccountFacade);
  private router = inject(Router);
  protected route = inject(ActivatedRoute);
  public isBid: boolean = false;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.user$ = this.authService.isUserLoggedIn().pipe(
      switchMap((isUserLoggedIn) => {
        if (isUserLoggedIn) {
          console.log(isUserLoggedIn)
          // this.router.navigate(['/analytics']);
          return this.userAccount.get();
        } else {
          this.router.navigate(['/login']);
          return of(undefined);
        }
      })
    );
    if (localStorage.getItem('Bid') === 'true') {
      this.isBid = true;
    }
    else {
      this.isBid = false;
    }
    if (this.router.url === '/chatbot') {
      document.body.classList.add('chatbot-active');
    } else {
      document.body.classList.remove('chatbot-active');
      this.cdr.detectChanges();
    }
    this.pageUrl = document.URL.split('/').pop();
  }

  back() {
    window.history.back();
  }

  openLogoutPopup() {
    this.showLogoutPopup = true;
  }

  closeLogoutPopup() {
    this.showLogoutPopup = false;
  }

  routeToHome() {
    this.routingService.go({ cxRoute: 'analytics' });
    this.datePickerService.setDays(0);
    localStorage.setItem('FromDate', '');
    localStorage.setItem('ToDate', '');
  }
}
