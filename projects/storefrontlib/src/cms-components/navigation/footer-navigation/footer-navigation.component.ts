import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cx-footer-navigation',
    templateUrl: './footer-navigation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FooterNavigationComponent {

  constructor() {}
}
