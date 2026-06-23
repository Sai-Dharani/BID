import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { RoutingService } from '@spartacus/core';
import { AnalyticsService, DataTableService, DatePickerService, StatusService } from '../../core';
import { filter, Subscription } from 'rxjs';
import { ExcelService } from '../../core/facade/excel.service';
import { LaunchDialogService } from '@spartacus/storefront';
import { LAUNCH_CALLER } from '../../modal-launch-caller.config';
import { BaseSiteStateService } from '../basesite/basesite.service';
declare let alasql: any;

// Ensure jQuery and DataTables are available globally for CCV2 environment
declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

// Use global jQuery if module import fails
const jQueryRef = (window.jQuery || window.$ || $);

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: false
})
export class DataTableComponent implements OnInit, OnDestroy {
  myScriptElement: any;
  linkElement: any;
  jqueryElement: any;
  productId: any;
  orderStatus: any;
  orderStatusSelection = [];
  orderListData = [];
  orderDataTable = [];
  orderList = [];
  tableData: any;
  OnModalConfirmation: any = false;
  modalRef: any;
  orderTotal: any;
  fromDate: any;
  toDate: any;
  currentDashlet: any;
  ticketStatus: any;
  ticketTotal: any;
  graphType = 'channel';
  channelStatus: any;
  channelTotal: any;
  totalEnquiries: any;
  totalComplaints: any;
  totalProblems: any;
  totalCreated: any;
  totalProcessing: any;
  totalCompleted: any;
  totalRejected: any;
  totalCancelled: any;
  orderStatusCount: any;
  userStatus: any;
  userTotal: any;
  isLoading: boolean = false;
  protected subscription = new Subscription();
  public routingService = inject(RoutingService);
  protected dataTableService = inject(DataTableService);
  protected statusService = inject(StatusService);
  protected launchDialogService = inject(LaunchDialogService);
  protected _cdr = inject(ChangeDetectorRef);
  protected excelService = inject(ExcelService);
  protected analytics = inject(AnalyticsService);
  protected datePickerService = inject(DatePickerService);
  protected baseSiteStateService = inject(BaseSiteStateService);
  cronJobStatus: any;
  cronJobTotal: any;

  ngOnInit(): void {
    console.log('[DataTable Component] ngOnInit - Component initializing');
    console.log('[DataTable Component] jQuery available:', typeof $ !== 'undefined');
    console.log('[DataTable Component] window.jQuery available:', typeof window.jQuery !== 'undefined');
    console.log('[DataTable Component] DataTable function available:', typeof $.fn !== 'undefined' && typeof $.fn.DataTable !== 'undefined');
    this.initData();
    this.checkDashlet();
  }
  //init data
  initData() {
    this.isLoading = true;
    this.subscription.add(this.datePickerService.selectedFromDate$.subscribe((fromDate) => {
      this.fromDate = fromDate;
    }))
    this.subscription.add(this.datePickerService.selectedToDate$.subscribe((toDate) => {
      this.toDate = toDate;
    }))
    this.subscription.add(this.dataTableService.selectedorderStatus$.subscribe((val) => {
      this.orderStatus = val;
    }));
    this.subscription.add(this.dataTableService.selectedorderTotal$.subscribe((val) => {
      this.orderTotal = val;
    }));
    this.subscription.add(this.dataTableService.selectedTicketStatus$.subscribe((val) => {
      this.ticketStatus = val;
    }));
    this.subscription.add(this.dataTableService.selectedTicketTotal$.subscribe((val) => {
      this.ticketTotal = val;
    }));
    this.subscription.add(this.dataTableService.selectedChannelStatus$.subscribe((val) => {
      this.channelStatus = val;
    }));
    this.subscription.add(this.dataTableService.selectedChannelTotal$.subscribe((val) => {
      this.channelTotal = val;
    }));
    this.subscription.add(this.dataTableService.selectedCronJobStatus$.subscribe((val) => {
      this.cronJobStatus = val;
    }));
    this.subscription.add(this.dataTableService.selectedCronJobTotal$.subscribe((val) => {
      this.cronJobTotal = val;
    }));
    this.subscription.add(this.dataTableService.selectedUserStatus$.subscribe((val) => {
      this.userStatus = val;
    }));
    this.subscription.add(this.dataTableService.selectedUserTotal$.subscribe((val) => {
      this.userTotal = val;
    }));
    this.subscription.add(this.analytics.currentDashlet$.subscribe((dashlet) => {
      if (JSON.stringify(dashlet) !== '{}') {
        this.currentDashlet = dashlet;
      } else {
        this.currentDashlet = localStorage.getItem("currentDashlet");
      }
    }))
  }
  //check current dashlet
  checkDashlet() {
    console.log('[DataTable Component] checkDashlet - Current dashlet:', this.currentDashlet);
    if (this.currentDashlet == 'order') {
      this.orderDaslet();
    }
    if (this.currentDashlet == 'ticket') {
      this.ticketDashlet();
    }
    if (this.currentDashlet == 'channel') {
      this.channelDashlet();
    }
    if (this.currentDashlet == 'cronJob') {
      this.cronJobDashlet();
    }
    if (this.currentDashlet == 'user') {
      this.userDashlet();
    }
  }
  userDashlet() {
    this.subscription.add(this.dataTableService.selectedUserStatus$.subscribe((status) => {
      if (status) {
        setTimeout(() => {
          this.subscription.add(
            this.baseSiteStateService.baseSite$
              .pipe(filter(basesite => basesite !== undefined))
              .subscribe(basesite => {
                console.log('Active BaseSite in Data Table Component:', basesite);
                if (basesite === 'All') {
                  basesite = '';
                }
                this.subscription.add(this.analytics.getUserDataWithStatus(this.fromDate, this.graphType, this.userStatus, this.toDate, basesite).subscribe((res) => {
                  this.tableData = res;
                  this.dataTableService.setCurrentTableData(this.tableData);
                  this.isLoading = false;
                  this._cdr.detectChanges();
                  this.tableData = this.userStatus == 'active' ? this.tableData.activeCustomers : this.tableData.inactiveCustomers;
                  this.createUserDataTable(this.tableData);
                }));
              }));
        }, 100);
      }
    }));
  }
  orderDaslet() {
    this.subscription.add(this.dataTableService.selectedorderStatus$.subscribe((status) => {
      if (status) {
        setTimeout(() => {
          // need to delete getOrderDataWithStatus when we will do lazy loading pagination
          // call this.createOrderDataTable();
          this.subscription.add(
            this.baseSiteStateService.baseSite$
              .pipe(filter(basesite => basesite !== undefined))
              .subscribe(basesite => {
                console.log('Active BaseSite in Data Table Component:', basesite);
                if (basesite === 'All') {
                  basesite = '';
                }
                this.subscription.add(this.analytics.getOrderDataWithStatus(this.fromDate, this.orderStatus, this.toDate, basesite).subscribe((res) => {
                  if (!res || !res.orders) {
                    console.error('Invalid order data received:', res);
                    this.isLoading = false;
                    this.tableData = [];
                    this.createOrderDataTable([]);
                    return;
                  }
                  this.tableData = res.orders;
                  this.dataTableService.setCurrentTableData(this.tableData);
                  this.isLoading = false;
                  this._cdr.detectChanges();
                  this.orderStatusCount = res.statusCount;
                  this.statusService.orderSubStatus(this.orderStatusCount);
                  this.createOrderDataTable(this.tableData);
                }));
              }));
        }, 100);
      }
    }));
  }
  ticketDashlet() {
    this.subscription.add(this.dataTableService.selectedTicketStatus$.subscribe((status) => {
      if (status) {
        setTimeout(() => {
          // need to delete getTicketDataWithStatus when we will do lazy loading pagination
          // call this.createOrderDataTable();
          this.subscription.add(
            this.baseSiteStateService.baseSite$
              .pipe(filter(basesite => basesite !== undefined))
              .subscribe(basesite => {
                console.log('Active BaseSite in Data Table Component:', basesite);
                if (basesite === 'All') {
                  basesite = '';
                }
                this.subscription.add(this.analytics.getTicketDataWithStatus(this.fromDate, this.ticketStatus, this.toDate, basesite).subscribe((res) => {
                  this.tableData = res.tickets;
                  this.dataTableService.setCurrentTableData(this.tableData);
                  this.isLoading = false;
                  this._cdr.detectChanges();
                  this.totalEnquiries = 0;
                  this.totalComplaints = 0;
                  this.totalProblems = 0;
                  for (const element of this.tableData) {
                    if (element.ticketCategory.name == 'Enquiry') {
                      this.totalEnquiries++;
                    }
                    else if (element.ticketCategory.name == 'Complaint') {
                      this.totalComplaints++;
                    }
                    else if (element.ticketCategory.name == 'Problem') {
                      this.totalProblems++;
                    }
                  }
                  this.statusService.Enquiries(this.totalEnquiries);
                  this.statusService.Complaints(this.totalComplaints);
                  this.statusService.Problems(this.totalProblems);
                  this.createTicketDataTable(this.tableData);
                }));
              }));
        }, 100);
      }
    }));
  }
  channelDashlet() {
    this.subscription.add(this.dataTableService.selectedChannelStatus$.subscribe((status) => {
      if (status) {
        setTimeout(() => {
          // need to delete getChannelDataWithStatus when we will do lazy loading pagination
          // call this.createOrderDataTable();
          this.subscription.add(
            this.baseSiteStateService.baseSite$
              .pipe(filter(basesite => basesite !== undefined))
              .subscribe(basesite => {
                console.log('Active BaseSite in Data Table Component:', basesite);
                if (basesite === 'All') {
                  basesite = '';
                }
                this.subscription.add(this.analytics.getChannelDataWithStatus(this.fromDate, this.graphType, this.channelStatus, this.toDate, basesite).subscribe((res) => {
                  this.tableData = res.orders;
                  this.dataTableService.setCurrentTableData(this.tableData);
                  this.isLoading = false;
                  this._cdr.detectChanges();
                  this.orderStatusCount = res.statusCount;
                  this.statusService.orderSubStatus(this.orderStatusCount);
                  this.createChannelDataTable(this.tableData);
                }));
              }));
        }, 100);
      }
    }));
  }
  cronJobDashlet() {
    this.subscription.add(this.dataTableService.selectedCronJobStatus$.subscribe((status) => {
      if (status) {
        setTimeout(() => {
          // need to delete getOrderDataWithStatus when we will do lazy loading pagination
          // call this.createOrderDataTable();
          this.subscription.add(
            this.baseSiteStateService.baseSite$
              .pipe(filter(basesite => basesite !== undefined))
              .subscribe(basesite => {
                console.log('Active BaseSite in Data Table Component:', basesite);
                if (basesite === 'All') {
                  basesite = '';
                }
                this.subscription.add(this.analytics.getOrderDataWithStatus(this.fromDate, this.cronJobStatus, this.toDate, basesite).subscribe((res) => {
                  this.tableData = res.orders;
                  this.dataTableService.setCurrentTableData(this.tableData);
                  this.isLoading = false;
                  this._cdr.detectChanges();
                  this.orderStatusCount = res.statusCount;
                  this.statusService.orderSubStatus(this.orderStatusCount);
                  this.createOrderDataTable(this.tableData);
                }));
              }));
        }, 100);
      }
    }));
  }
  //For Order
  createOrderDataTable(tableData) {
    console.log('[Order DataTable] createOrderDataTable called with data length:', tableData?.length);
    const $jQuery = jQueryRef;
    console.log('[Order DataTable] jQueryRef type:', typeof $jQuery);
    console.log('[Order DataTable] $.fn available:', typeof $jQuery.fn !== 'undefined');
    console.log('[Order DataTable] $.fn.DataTable available:', typeof $jQuery.fn?.DataTable !== 'undefined');
    
    // Ensure DataTables is loaded
    if (!$jQuery.fn.DataTable) {
      console.error('[Order DataTable] DataTables is not loaded. Retrying in 500ms...');
      console.error('[Order DataTable] $jQuery.fn:', $jQuery.fn);
      setTimeout(() => this.createOrderDataTable(tableData), 500);
      return;
    }

    console.log('[Order DataTable] DataTables library confirmed loaded');
    console.log('[Order DataTable] Looking for element #orderSummaryDT, found:', $jQuery('#orderSummaryDT').length);

    $jQuery('#orderSummaryDT .filters th').each(function () {
      const title = $jQuery(this).text();
      $jQuery(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    // Safely destroy existing table
    if ($jQuery.fn.DataTable.isDataTable('#orderSummaryDT')) {
      console.log('[Order DataTable] Existing table found, destroying...');
      $jQuery('#orderSummaryDT').DataTable().clear().destroy();
      console.log('[Order DataTable] Table destroyed successfully');
    }
    
    console.log('[Order DataTable] Initializing new DataTable...');
    try {
      $jQuery('#orderSummaryDT').DataTable({
      data: tableData,
      dom: 'ltipr',
      /* Commenting code for Lazy loading pagination*/
      //pagingType: 'full_numbers',
      //serverSide: true,
      //processing: true,
      // pageLength : 10,
      searching: true,
      // lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
      // ajax : (dataTablesParameters: any, callback) => {
      //   //this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getOrderDataWithStatus(this.fromDate,  this.orderStatus, this.toDate).subscribe((res)=>{
      //     this.tableData = res.orders.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //      callback({
      //       recordsTotal: this.orderTotal,
      //       recordsFiltered: this.orderTotal,
      //       data : this.tableData
      //     });
      //   });
      //   },
      columns: [
        { data: 'code' },
        { data: 'placedDateStr' },
        { data: 'total.formattedValue' },
        { data: 'status' },
      ],
      initComplete: function () {
        // Apply the search
        this.api()
          .columns()
          .every(function (colIdx) {
            const that = this;

            $('input', $('.filters th')[colIdx]).on('keyup change clear', function () {
              if (that.search() !== (<HTMLInputElement>this).value) {
                that.search((<HTMLInputElement>this).value).draw();
              }
            });
            // Apply the search
            $('.dataTables_filter input.form-control-sm').on('keyup', function () {
              $('.reports-top-details-container .reports-top-details').removeClass('active');
            });
          });

      },
      /* Uncomment drawCallback function code when we will implement lazy loading Pagination*/

      // drawCallback: () => {
      //   $('.paginate_button.next, .paginate_button').on('click', () => {
      //     ajax :(dataTablesParameters: any, callback) => {
      //    // this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getOrderDataWithStatus(this.fromDate,  this.orderStatus, this.toDate).subscribe((res)=>{
      //       this.tableData = res.orders.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //       console.log(this.tableData);
      //        callback({
      //         recordsTotal : this.orderTotal,
      //         recordsFiltered : this.orderTotal,
      //         data : []
      //       });
      //     });
      //     };
      //   });
      // }
    });
    console.log('[Order DataTable] DataTable created successfully');
    } catch (error) {
      console.error('[Order DataTable] Error creating DataTable:', error);
      console.error('[Order DataTable] Error stack:', error.stack);
    }

    //On click of datatable row
    $jQuery('#orderSummaryDT').off().on('click', 'tbody tr', (e) => {
      this.routeTo(e.currentTarget.childNodes[0].innerText);
    });
  }

  //For Ticket
  createTicketDataTable(tableData) {
    console.log('[Ticket DataTable] createTicketDataTable called with data length:', tableData?.length);
    const $jQuery = jQueryRef;
    console.log('[Ticket DataTable] $.fn.DataTable available:', typeof $jQuery.fn?.DataTable !== 'undefined');
    
    // Ensure DataTables is loaded
    if (!$jQuery.fn.DataTable) {
      console.error('[Ticket DataTable] DataTables is not loaded. Retrying in 500ms...');
      setTimeout(() => this.createTicketDataTable(tableData), 500);
      return;
    }

    console.log('[Ticket DataTable] DataTables library confirmed loaded');
    console.log('[Ticket DataTable] Looking for element #ticketSummaryDT, found:', $jQuery('#ticketSummaryDT').length);

    $jQuery('#ticketSummaryDT .filters th').each(function () {
      const title = $jQuery(this).text();
      $jQuery(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
    
    // Safely destroy existing table
    if ($jQuery.fn.DataTable.isDataTable('#ticketSummaryDT')) {
      console.log('[Ticket DataTable] Existing table found, destroying...');
      $jQuery('#ticketSummaryDT').DataTable().clear().destroy();
    }
    
    console.log('[Ticket DataTable] Initializing new DataTable...');
    try {
      $jQuery('#ticketSummaryDT').DataTable({
      data: tableData,
      dom: 'ltipr',
      //pagingType: 'full_numbers',x
      //serverSide: true,
      // processing: true,
      //pageLength : 10,
      searching: true,
      //lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
      // ajax : (dataTablesParameters: any, callback) => {
      //   //this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getTicketDataWithStatus(this.fromDate,  this.ticketStatus, this.toDate).subscribe((res)=>{
      //     this.tableData = res.tickets.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //      callback({
      //       recordsTotal: this.ticketTotal,
      //       recordsFiltered: this.ticketTotal,
      //       data : this.tableData
      //     });
      //   });
      //   },
      columns: [
        { data: 'id' },
        { data: 'creationDateStr' },
        { data: 'ticketCategory.name' },
        { data: 'status.name' },
        { data: 'customerId' }
      ],
      initComplete: function () {
        console.log('[Ticket DataTable] initComplete callback - DataTable initialized successfully');
        // Apply the search
        this.api()
          .columns()
          .every(function (colIdx) {
            const that = this;

            $('input', $('.filters th')[colIdx]).on('keyup change clear', function () {
              if (that.search() !== (<HTMLInputElement>this).value) {
                that.search((<HTMLInputElement>this).value).draw();
              }
            });
            $('.dataTables_filter input.form-control-sm').on('keyup', function () {
              $('.reports-top-details-container .reports-top-details').removeClass('active');
            });
          });

      },
      /* Uncomment drawCallback function code when we will implement lazy loading Pagination*/

      // drawCallback: () => {
      //   $('.paginate_button.next, .paginate_button').on('click', () => {
      //     ajax :(dataTablesParameters: any, callback) => {
      //    // this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getTicketDataWithStatus(this.fromDate,  this.ticketStatus, this.toDate).subscribe((res)=>{
      //       this.tableData = res.tickets.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //       console.log(this.tableData);
      //        callback({
      //         recordsTotal : this.ticketTotal,
      //         recordsFiltered : this.ticketTotal,
      //         data : []
      //       });
      //     });
      //     };
      //   });
      // }
    });
    console.log('[Ticket DataTable] DataTable created successfully');
    } catch (error) {
      console.error('[Ticket DataTable] Error creating DataTable:', error);
      console.error('[Ticket DataTable] Error stack:', error.stack);
    }

    //On click of datatable row
    $jQuery('#ticketSummaryDT').off().on('click', 'tbody tr', (e) => {
      this.routeTo(e.currentTarget.childNodes[0].innerText);
    });
  }


  //For Channel
  createChannelDataTable(tableData) {
    console.log('[Channel DataTable] createChannelDataTable called with data length:', tableData?.length);
    const $jQuery = jQueryRef;
    console.log('[Channel DataTable] $.fn.DataTable available:', typeof $jQuery.fn?.DataTable !== 'undefined');
    
    // Ensure DataTables is loaded
    if (!$jQuery.fn.DataTable) {
      console.error('[Channel DataTable] DataTables is not loaded. Retrying in 500ms...');
      setTimeout(() => this.createChannelDataTable(tableData), 500);
      return;
    }

    console.log('[Channel DataTable] DataTables library confirmed loaded');
    console.log('[Channel DataTable] Looking for element #channelSummaryDT, found:', $jQuery('#channelSummaryDT').length);

    $jQuery('#channelSummaryDT .filters th').each(function () {
      const title = $jQuery(this).text();
      $jQuery(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
    
    // Safely destroy existing table
    if ($jQuery.fn.DataTable.isDataTable('#channelSummaryDT')) {
      console.log('[Channel DataTable] Existing table found, destroying...');
      $jQuery('#channelSummaryDT').DataTable().clear().destroy();
    }
    
    console.log('[Channel DataTable] Initializing new DataTable...');
    try {
      $jQuery('#channelSummaryDT').DataTable({
      data: tableData,
      dom: 'ltipr',
      //pagingType: 'full_numbers',
      //serverSide: true,
      // processing: true,
      //pageLength : 10,
      searching: true,
      //lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
      // ajax : (dataTablesParameters: any, callback) => {
      //   //this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getChannelDataWithStatus(this.fromDate,  this.ticketStatus, this.toDate).subscribe((res)=>{
      //     this.tableData = res.tickets.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //      callback({
      //       recordsTotal: this.ticketTotal,
      //       recordsFiltered: this.ticketTotal,
      //       data : this.tableData
      //     });
      //   });
      //   },
      columns: [
        { data: 'code' },
        { data: 'placedDateStr' },
        { data: 'total.formattedValue' },
        { data: 'status' },
      ],
      initComplete: function () {
        console.log('[Channel DataTable] initComplete callback - DataTable initialized successfully');
        // Apply the search
        this.api()
          .columns()
          .every(function (colIdx) {
            const that = this;

            $('input', $('.filters th')[colIdx]).on('keyup change clear', function () {
              if (that.search() !== (<HTMLInputElement>this).value) {
                that.search((<HTMLInputElement>this).value).draw();
              }
            });
            $('.dataTables_filter input.form-control-sm').on('keyup', function () {
              $('.reports-top-details-container .reports-top-details').removeClass('active');
            });
          });
      },
      /* Uncomment drawCallback function code when we will implement lazy loading Pagination*/

      // drawCallback: () => {
      //   $('.paginate_button.next, .paginate_button').on('click', () => {
      //     ajax :(dataTablesParameters: any, callback) => {
      //    // this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getTicketDataWithStatus(this.fromDate,  this.ticketStatus, this.toDate).subscribe((res)=>{
      //       this.tableData = res.tickets.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //       console.log(this.tableData);
      //        callback({
      //         recordsTotal : this.ticketTotal,
      //         recordsFiltered : this.ticketTotal,
      //         data : []
      //       });
      //     });
      //     };
      //   });
      // }
    });
    console.log('[Channel DataTable] DataTable created successfully');
    } catch (error) {
      console.error('[Channel DataTable] Error creating DataTable:', error);
      console.error('[Channel DataTable] Error stack:', error.stack);
    }

    //On click of datatable row
    $jQuery('#channelSummaryDT').off().on('click', 'tbody tr', (e) => {
      this.routeTo(e.currentTarget.childNodes[0].innerText);
    });
  }


  //For User activity
  createUserDataTable(tableData) {
    console.log('[User DataTable] createUserDataTable called with data length:', tableData?.length);
    const $jQuery = jQueryRef;
    console.log('[User DataTable] $.fn.DataTable available:', typeof $jQuery.fn?.DataTable !== 'undefined');
    
    // Ensure DataTables is loaded
    if (!$jQuery.fn.DataTable) {
      console.error('[User DataTable] DataTables is not loaded. Retrying in 500ms...');
      setTimeout(() => this.createUserDataTable(tableData), 500);
      return;
    }

    console.log('[User DataTable] DataTables library confirmed loaded');
    console.log('[User DataTable] Looking for element #userSummaryDT, found:', $jQuery('#userSummaryDT').length);

    $jQuery('#userSummaryDT .filters th').each(function () {
      const title = $jQuery(this).text();
      $jQuery(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    // Safely destroy existing table
    if ($jQuery.fn.DataTable.isDataTable('#userSummaryDT')) {
      console.log('[User DataTable] Existing table found, destroying...');
      $jQuery('#userSummaryDT').DataTable().clear().destroy();
    }
    
    console.log('[User DataTable] Initializing new DataTable...');
    try {
      $jQuery('#userSummaryDT').DataTable({
      data: tableData,
      dom: 'ltipr',
      searching: true,
      columns: [
        { data: 'name' },
        { data: 'uid' },
      ],
      initComplete: function () {
        console.log('[User DataTable] initComplete callback - DataTable initialized successfully');
        // Apply the search
        this.api()
          .columns()
          .every(function (colIdx) {
            const that = this;

            $('input', $('.filters th')[colIdx]).on('keyup change clear', function () {
              if (that.search() !== (<HTMLInputElement>this).value) {
                that.search((<HTMLInputElement>this).value).draw();
              }
            });
            // Apply the search
            $('.dataTables_filter input.form-control-sm').on('keyup', function () {
              $('.reports-top-details-container .reports-top-details').removeClass('active');
            });
          });

      },
      /* Uncomment drawCallback function code when we will implement lazy loading Pagination*/

      // drawCallback: () => {
      //   $('.paginate_button.next, .paginate_button').on('click', () => {
      //     ajax :(dataTablesParameters: any, callback) => {
      //    // this.dataTableService.selectedtableData$.subscribe((res) => {
      //     this.analytics.getOrderDataWithStatus(this.fromDate,  this.orderStatus, this.toDate).subscribe((res)=>{
      //       this.tableData = res.orders.slice(dataTablesParameters.start,10+dataTablesParameters.start);
      //       console.log(this.tableData);
      //        callback({
      //         recordsTotal : this.orderTotal,
      //         recordsFiltered : this.orderTotal,
      //         data : []
      //       });
      //     });
      //     };
      //   });
      // }
    });
    console.log('[User DataTable] DataTable created successfully');
    } catch (error) {
      console.error('[User DataTable] Error creating DataTable:', error);
      console.error('[User DataTable] Error stack:', error.stack);
    }
  }
  routeTo(id) {
    localStorage.setItem("Id", id);
    this.launchDialogService.openDialogAndSubscribe(
      LAUNCH_CALLER.GENERAL_MODAL_POPUP,
    );
  }

  exportJson(): void {
    if (this.currentDashlet == 'order') {
      const res = alasql('SEARCH / AS @data  RETURN(@data->code AS Order_No, @data->placedDateStr AS Order_Date, @data->total.formattedValue AS Price, @data->status AS Status) FROM ?', [this.tableData])
      this.excelService.exportAsExcelFile(res, 'Order Summary');
    }
    if (this.currentDashlet == 'ticket') {
      const res = alasql('SEARCH / AS @data  RETURN(@data->id AS Ticket_No, @data->createdAt AS CreatedAt_Date, @data->ticketCategory.name AS Ticket_Category, @data->status.name AS Status)  FROM ?', [this.tableData])
      this.excelService.exportAsExcelFile(res, 'Ticket Summary');
    }
    if (this.currentDashlet == 'channel') {
      const res = alasql('SEARCH / AS @data  RETURN(@data->code AS Order_No, @data->placedDateStr AS Order_Date, @data->total.formattedValue AS Price, @data->status AS Status)  FROM ?', [this.tableData])
      this.excelService.exportAsExcelFile(res, 'Channel Summary');
    }
    if (this.currentDashlet == 'user') {
      const res = alasql('SEARCH / AS @data RETURN(@data->name AS User_Name, @data->uid AS User_Email)  FROM ?', [this.tableData])
      this.excelService.exportAsExcelFile(res, 'User Summary');
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}