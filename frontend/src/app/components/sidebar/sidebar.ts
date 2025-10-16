import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarService } from './sidebar.service'; // Ajusta la ruta
import { AuthService } from '../../features/UsuarioObstetra/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  isSidebarMinimized: boolean = false;
  isProgramasActive: boolean = false;

  userFirstName: string = 'María';
  userLastName: string = 'Flores';
  userRole: string = 'Obstetra';
  userInitials: string = '';

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.userInitials = this.getInitials(this.userFirstName, this.userLastName);
    this.checkProgramasActive(this.router.url);
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkProgramasActive(event.url);
      });

    // Suscribirse al estado del sidebar
    this.sidebarService.isMinimized$.subscribe(isMinimized => {
      this.isSidebarMinimized = isMinimized;
    });
  }

  checkProgramasActive(url: string): void {
    this.isProgramasActive = url.includes('/diagnostico') || url.includes('/puerperio');
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  logout(): void {
    console.log('Usuario ha cerrado sesión.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}