import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { filter } from 'rxjs';
import { NgClass } from '@angular/common';
import { SidebarService } from './components/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  showSidebar: boolean = true;
  isSidebarMinimized: boolean = false;

  constructor(private router: Router, private sidebarService: SidebarService) {
    // Detectar ruta para mostrar/ocultar sidebar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showSidebar = !event.url.includes('/login');        
      });

    // Suscribirse al estado del sidebar
    this.sidebarService.isMinimized$.subscribe(isMinimized => {
      this.isSidebarMinimized = isMinimized;
    });
  }
}
