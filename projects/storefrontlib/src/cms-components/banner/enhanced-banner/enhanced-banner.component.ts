import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CmsComponent, ProductService } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'cx-ps-enhanced-banner',
    templateUrl: './enhanced-banner.component.html',
    standalone: false
})
export class PSEnhancedBannerComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  component$: Observable<CmsComponent>;

  protected componentData = inject(CmsComponentData<CmsComponent>);

  ngOnInit() {
    this.component$ = this.componentData.data$;
    this.subscription.add(
      this.component$.pipe(
      )
        .subscribe(s => {
          console.log(s);
        })
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
