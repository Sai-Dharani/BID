import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService, RoutingService } from '@spartacus/core';

@Component({
  selector: 'app-logout-confirm',
  templateUrl: './logout-confirm.component.html',
  styleUrls: ['./logout-confirm.component.scss'],
  standalone: false,
})
export class LogoutConfirmComponent {

  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private routingService: RoutingService
  ) {}

  confirmLogout() {
   this.close.emit(); // close popup first
  window.location.href = '/logout';
  }

  cancel() {
    this.close.emit();
  }
}
