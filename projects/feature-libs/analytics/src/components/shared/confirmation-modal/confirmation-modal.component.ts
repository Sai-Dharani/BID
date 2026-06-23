import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { DataTableService, StatusService } from '../../../core';
import { LaunchDialogService } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    standalone: false
})
export class ConfirmationModalComponent implements OnDestroy{

  title: string;
  message: string;
  OnModalConfirmation: any = false;
  orderStatus: any;
  protected subscription = new Subscription();
  private dataTableService =  inject(DataTableService);
  private _cdr =  inject(ChangeDetectorRef);
  protected launchDialogService = inject(LaunchDialogService);
  private statusService = inject(StatusService);

  constructor() {
    this.subscription.add(this.dataTableService.selectedorderStatus$.subscribe((val) => {
      this.orderStatus = val;
    }));
  }


  save(){
    this.subscription.add(this.dataTableService.selectedtableData$.subscribe(
      (response) => {
        if(this.orderStatus == 'COMPLETED' && this.OnModalConfirmation==false){
          this.OnModalConfirmation = true;
          this.statusService.onModalConfirmation(this.OnModalConfirmation);
          this._cdr.detectChanges();
        }
      }));
    setTimeout(() => {
      this.launchDialogService.closeDialog(true);
    }, 200);
  }

  cancel(){
    this.launchDialogService.closeDialog(true);
    this.subscription.unsubscribe();
  }

  closeModal() {
    this.launchDialogService.closeDialog(true);
  }
  ngOnDestroy() {  
    // unsubscribe to ensure no memory leaks  
    this.subscription.unsubscribe();  
  }  



}
