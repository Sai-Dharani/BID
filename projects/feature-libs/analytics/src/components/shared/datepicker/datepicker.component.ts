import { Component, EventEmitter, inject, Injectable, OnDestroy, Output } from '@angular/core';
import {
	NgbCalendar,
	NgbDate,
	NgbDateAdapter,
	NgbDateParserFormatter,
	NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerService, StatusService } from '../../../core';
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
import { Subscription } from 'rxjs';
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				year: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				day: parseInt(date[2], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.year + this.DELIMITER + date.month +  this.DELIMITER + date.day : '';
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				year: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				day: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.year + this.DELIMITER + date.month +  this.DELIMITER + date.day : '';
	}
}

@Component({
    selector: 'ngbd-datepicker-adapter',
    templateUrl: './datepicker.component.html',
    // NOTE: For this example we are only providing current component, but probably
    // NOTE: you will want to provide your main App Module
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    ],
    standalone: false
})
export class NgbdDatepickerAdapter implements OnDestroy {
	model1: any;
	model2: any;
	date = new Date();
	year: any;
	month: any;
	day:any;
	fromYear: any;
	fromMonth: any;
	fromDay:any;
	toYear: any;
	toMonth: any;
	toDay:any;
	filterClick: any;
	readonly DELIMITER = '-';
	protected subscription = new Subscription();
	@Output() selectedDate = new EventEmitter<string>();
	private ngbCalendar = inject(NgbCalendar); 
	private dateAdapter = inject(NgbDateAdapter<string>);
	private datePickerService = inject(DatePickerService); 
	private statusService = inject(StatusService);
	constructor() {
			this.year = this.date.getFullYear();
			this.month = this.date.getMonth()+1;
			this.day = this.date.getDate();
			// Subscribe to reset events from service
			this.subscription.add(
				this.datePickerService.shouldResetDates$.subscribe((shouldReset) => {
					if (shouldReset) {
						this.resetDate();
					}
				})
			);
		}

	get today() {
		return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
	}

	 onDateSelection(date: NgbDate) {
		this.fromYear = date.year;
		this.fromDay = date.day;
		this.fromMonth = date.month;
		if(date.year == this.year || date.year == this.year-1){
			this.toYear = this.year;
			this.toDay = this.day;
			this.toMonth = this.month;
		}
		else{
			this.toYear = date.year+2;
			this.toDay = date.day;
			this.toMonth = date.month;
		}
	 }

	getDate(){
		this.selectedDate.emit(this.model1);
		this.selectedDate.emit(this.model2);
	}

	filterDate(){
		this.getDays(this.model1, this.model2);
		this.filterClick = false;
		this.statusService.onModalConfirmation(this.filterClick);
	}
	getDays(fromDate, toDate){
		let startDate = new Date(fromDate);
		let endDate = new Date(toDate);
		let Time = endDate.getTime() - startDate.getTime();
		let days = Time / (1000 * 3600 * 24);
		this.datePickerService.setDays(days);
		this.datePickerService.getFilterDates(fromDate, toDate);
		localStorage.setItem("fromDate", fromDate);
		localStorage.setItem("toDate", toDate);
		return days;
	}

	resetDate(){
		this.model1 = undefined;
		this.model2 = undefined;
		this.datePickerService.setDays(0);
	}

	testApi(){
		this.subscription.add(this.datePickerService.getApi().subscribe((res)=>console.log(res)));
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}