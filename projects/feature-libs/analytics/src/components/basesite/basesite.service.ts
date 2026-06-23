import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })

export class BaseSiteStateService {
  private baseSiteSubject = new BehaviorSubject<string>('');
  baseSite$ = this.baseSiteSubject.asObservable();

  setBaseSite(site: string) {
    this.baseSiteSubject.next(site);
  }
}
