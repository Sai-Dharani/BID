import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { OccEndpointsService, BaseSiteService } from '@spartacus/core'
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private occEndpointsService = inject(OccEndpointsService);
  private baseSiteService = inject(BaseSiteService);

  getStatuses(endpoint: string, fromDate: string, toDate: string): Observable<any> {
    return this.baseSiteService.getActive().pipe(
      switchMap(baseSite => {
        const baseUrl = this.occEndpointsService.getBaseUrl();
        const url = `${baseUrl}/${endpoint}?fields=DEFAULT&fromDate=${fromDate}&toDate=${toDate}&baseSite=${baseSite}`;
        return this.http.get<any>(url).pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          })
        );
      })
    );
  }
}