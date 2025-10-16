import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private minimizedSubject = new BehaviorSubject<boolean>(false);
  isMinimized$ = this.minimizedSubject.asObservable();

  toggleSidebar(): void {
    this.minimizedSubject.next(!this.minimizedSubject.value);
  }

  getState(): boolean {
    return this.minimizedSubject.value;
  }
}