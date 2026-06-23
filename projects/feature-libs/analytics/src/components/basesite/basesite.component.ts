import { Component, OnInit, inject } from '@angular/core';
import { BaseSiteService} from '@spartacus/core';
import { Subscription } from 'rxjs';
import { BaseSiteStateService } from './basesite.service';

@Component({
  selector: 'app-basesite',
  templateUrl: './basesite.component.html',
  styleUrls: ['./basesite.component.scss'],
  standalone: false
})

export class BasesiteComponent implements OnInit {
  baseSites: string[] = [];
  filteredBaseSites: string[] = [];
  open = false;
  selected: string | null = null;
  searchText = '';
  readonly ALL_OPTION = 'All';

  protected subscription = new Subscription();
  protected baseSiteService = inject(BaseSiteService);
  protected baseSiteStateService = inject(BaseSiteStateService);


  ngOnInit(): void {
    // Get BaseSites from store (no extra API call)
    this.subscription.add(
      this.baseSiteService.getAll().subscribe(sites => {
        const siteUids = sites.map(site => site.uid);
        this.baseSites = [this.ALL_OPTION, ...siteUids];
        this.selected = this.ALL_OPTION;
        console.log('Selected BaseSite:', this.selected);
        this.baseSiteStateService.setBaseSite(this.selected);
        this.filteredBaseSites = [...this.baseSites];
      })
    );
  }

  /** Toggle dropdown open/close */
  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.searchText = '';
      this.filteredBaseSites = [...this.baseSites];
    }
  }

  /** Clear selection */
  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selected = this.ALL_OPTION;
    this.searchText = '';
    this.filteredBaseSites = [...this.baseSites];
  }

  /** Filter BaseSites based on search text */
  filter(value: string): void {
    this.searchText = value.toLowerCase();
    this.filteredBaseSites = this.baseSites.filter(uid =>
      uid.toLowerCase().includes(this.searchText)
    );
  }

  /** Select BaseSite */
  select(site: string): void {
    this.selected = site;
    this.open = false;
    if (site === this.ALL_OPTION) {
      console.log('All BaseSites selected');
    } else {
      console.log('Selected BaseSite:', site);
    }
     this.baseSiteStateService.setBaseSite(site);
  }

  /** Close dropdown when clicking outside (optional) */
  close(): void {
    this.open = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}