import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn:"root"
})
export class DataService{
  private _data$ = new BehaviorSubject<any>(null);
  data$ = this._data$.asObservable();

  setData(value: any) {
    localStorage.setItem("dataService",value);
    this._data$.next(value);
  }
}