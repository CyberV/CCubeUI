import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private headerSubject = new Subject();
  constructor() { }

  listner() {
    return this.headerSubject;
  }

  setText(text:string) {

    this.headerSubject.next({
      key: 'text',
      data: text
    });
  }

  hideHeader() {
    this.headerSubject.next({
      key: 'hide',
      data : true
    });
  }

  setView(viewName:string, viewOptions:any) {
    this.headerSubject.next({
      key: 'view',
      data: {
        viewName: viewName,
        viewOptions: viewOptions
      }
    });
  }
}
