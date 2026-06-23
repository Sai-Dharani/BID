import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataTableService } from '../../core/facade/datatable.service';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  private dataTableService = inject(DataTableService);

  /**
   * 1️⃣ Provides table data + PDF metadata to component
   */
  getPDFData(dashletType: string = 'ticket'): Observable<{
    currentTableData: any[];
    pdfData: { title: string; date?: string; dashletType: string };
  }> {
    const titles = {
      'order': 'Order Summary',
      'ticket': 'Ticket Summary',
      'channel': 'Channel Summary',
      'user': 'User Summary'
    };

    return this.dataTableService.getCurrentTableData().pipe(
      map(currentTableData => {
        console.log('[PDFService] getPDFData - currentTableData:', currentTableData);
        console.log('[PDFService] Is array?', Array.isArray(currentTableData));
        console.log('[PDFService] Length:', Array.isArray(currentTableData) ? currentTableData.length : 'N/A');
        console.log('[PDFService] Dashlet type:', dashletType);
        return {
          currentTableData,
          pdfData: {
            title: titles[dashletType] || 'Summary',
            date: new Date().toLocaleDateString(),
            dashletType
          }
        };
      })
    );
  }

  /**
   * 2️⃣ Actually generates the PDF
   */
  generatePDF(tableData: any[], pdfMeta: any): Observable<string> {
    return new Observable(observer => {
      console.log('[PDFService] generatePDF called with tableData:', tableData);
      console.log('[PDFService] tableData length:', tableData?.length);
      console.log('[PDFService] First row sample:', tableData?.[0]);
      console.log('[PDFService] pdfMeta:', pdfMeta);
      console.log('[PDFService] dashletType from pdfMeta:', pdfMeta?.dashletType);

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header
      doc.setFontSize(18);
      doc.text(pdfMeta.title, pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Date: ${pdfMeta.date}`, pageWidth - 10, 30, { align: 'right' });

      // Determine table structure based on dashlet type
      const dashletType = pdfMeta.dashletType || 'ticket';
      console.log('[PDFService] Using dashletType:', dashletType);
      let head: string[][];
      let body: any[][];

      if (dashletType === 'order' || dashletType === 'channel') {
        console.log('[PDFService] Setting up ORDER/CHANNEL table structure');
        head = [['Order No', 'Order Date', 'Total Amount', 'Status']];
        body = tableData.map(row => [
          row.code ?? '',
          row.placedDateStr ?? '',
          row.total?.formattedValue ?? '',
          row.status ?? ''
        ]);
        console.log('[PDFService] Body rows:', body.length);
      } else if (dashletType === 'ticket') {
        console.log('[PDFService] Setting up TICKET table structure');
        head = [['Ticket No', 'Created Date', 'Category', 'Status', 'Customer ID']];
        body = tableData.map(row => [
          row.id ?? '',
          row.creationDateStr ?? '',
          row.ticketCategory?.name || row.ticketCategory?.code || '',
          row.status?.name || row.status?.code || '',
          row.customerId ?? ''
        ]);
        console.log('[PDFService] Body rows:', body.length);
      } else if (dashletType === 'user') {
        console.log('[PDFService] Setting up USER table structure');
        head = [['User Name', 'User Email']];
        body = tableData.map(row => [
          row.name ?? '',
          row.uid ?? ''
        ]);
        console.log('[PDFService] Body rows:', body.length);
      }

      // Table
      autoTable(doc, {
        startY: 40,
        head: head,
        body: body,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [0, 74, 172],
          textColor: 255
        }
      });

      // Footer (page numbers)
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 10,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      const url = URL.createObjectURL(doc.output('blob'));
      observer.next(url);
      observer.complete();
    });
  }
}
