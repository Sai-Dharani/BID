import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, filter, catchError, first } from 'rxjs/operators';
import { PDFService } from './pdf.service';
import { tap, shareReplay } from 'rxjs/operators';
import { AnalyticsService } from '../../core';

@Component({
    selector: 'cx-pdf',
    templateUrl: './pdf.component.html',
    styleUrls: ['./pdf.component.scss'],
    standalone: false
})
export class PDFComponent implements OnInit {
  data$: Observable<any>;
  url: string;
  private pdfService = inject(PDFService);
  private analytics = inject(AnalyticsService);
  currentDashlet: string = 'ticket';

  // ngOnInit() {
  //   this.data$ = this.pdfService.getPDFData().pipe(
  //     switchMap(({ currentTableData, pdfData }) => {
  //       return this.pdfService.generatePDF(pdfData.data, currentTableData).pipe(
  //         map(pdfUrl => {
  //           console.log('Generated PDF URL:', pdfUrl);
  //           this.url = pdfUrl;
  //           return pdfData;
  //         })
  //       );
  //     })
  //   );
  // }


ngOnInit() {
  console.log('[PDFComponent] ngOnInit - Initializing PDF component');
  
  // Get current dashlet first, then create PDF data stream
  this.analytics.currentDashlet$.subscribe((dashlet) => {
    if (dashlet && JSON.stringify(dashlet) !== '{}') {
      this.currentDashlet = dashlet;
    } else {
      this.currentDashlet = localStorage.getItem('currentDashlet') || 'ticket';
    }
    console.log('[PDFComponent] Current dashlet:', this.currentDashlet);
    
    // Now create the PDF data stream with the correct dashlet type
    this.createPDFStream();
  });
}

createPDFStream() {
  this.data$ = this.pdfService.getPDFData(this.currentDashlet).pipe(

    // 1️⃣ Ensure table data exists
    filter(({ currentTableData }) => {
      console.log('[PDFComponent] Filter - checking currentTableData:', currentTableData);
      console.log('[PDFComponent] Is array?', Array.isArray(currentTableData), 'Length:', currentTableData?.length);
      const passes = Array.isArray(currentTableData) && currentTableData.length > 0;
      console.log('[PDFComponent] Filter passes?', passes);
      return passes;
    }),

    // 2️⃣ Ensure PDF metadata exists
    filter(({ pdfData }) => !!pdfData),

    // 3️⃣ Get first valid emission (after both filters pass)
    first(),

    // 4️⃣ Generate PDF when data is ready
    switchMap(({ currentTableData, pdfData }) => {
      console.log('[PDFComponent] switchMap - received currentTableData:', currentTableData);
      console.log('[PDFComponent] currentTableData length:', currentTableData?.length);
      console.log('[PDFComponent] pdfData received:', pdfData);

      // Convert DataTables data → plain JS
      const safeTableData = JSON.parse(JSON.stringify(currentTableData));
      console.log('[PDFComponent] safeTableData after clone:', safeTableData);
      console.log('[PDFComponent] safeTableData length:', safeTableData?.length);

      // Use pdfData directly - it already has dashletType from the service
      const safePdfMeta = pdfData;
      console.log('[PDFComponent] safePdfMeta to be sent:', safePdfMeta);

      // 🔴 THIS is the only place generatePDF is called
      return this.pdfService.generatePDF(
        safeTableData,
        safePdfMeta
      ).pipe(
        tap(url => this.url = url),

        // Data for template (button label)
        map(() => safePdfMeta)
      );
    }),

    // 5️⃣ Prevent re-execution by async pipe
    shareReplay(1),

    // 6️⃣ Safety net
    catchError(err => {
      console.error('PDF generation failed', err);
      return of(null);
    })
  );
}

  addPdfExtension(title: string): string {
    return `${title}`;
  }
}
