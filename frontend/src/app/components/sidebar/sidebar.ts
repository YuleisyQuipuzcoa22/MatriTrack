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

  userFirstName: string = '';
  userLastName: string = '';
  userRole: string = 'Cargando...';
  userInitials: string = '??';

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    //cargamos datos del usuario
    this.loadUserDataFromSession();
    //logica enrutamiento y estado sidebar
    this.checkProgramasActive(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkProgramasActive(event.url);
      });

    // Suscribirse al estado del sidebar
    this.sidebarService.isMinimized$.subscribe((isMinimized) => {
      this.isSidebarMinimized = isMinimized;
    });
  }
  //carga datos del usuario desde el localStorage/authservice (sesion)
  loadUserDataFromSession(): void {
    const firstName = this.authService.getFirstName();
    const lastName = this.authService.getLastName();
    const role = this.authService.getRole();

    if (firstName && lastName) {
      this.userFirstName = firstName;
      this.userLastName = lastName;
      this.userInitials = this.getInitials(firstName, lastName);
    } 
    
    if (role) {
        this.userRole = role;
    }
    
    if (!firstName || !lastName || !role) {
      
      console.warn('Faltan datos, aun no se inicia sesión o hay un problema:)');
    }
  }
  

  checkProgramasActive(url: string): void {
    this.isProgramasActive = url.includes('/diagnostico') || url.includes('/puerperio');
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  //se queda con la primera inicial del nombre y apellido
  getInitials(firstName: string, lastName: string): string {
    const cleanFirstName = firstName ? firstName.trim().split(' ')[0] : '';
    const cleanLastName = lastName ? lastName.trim().split(' ')[0] : '';

    const firstInitial = cleanFirstName.charAt(0) || '';
    const lastInitial = cleanLastName.charAt(0) || '';
    if (!firstInitial && !lastInitial) return '??';

    return (firstInitial + lastInitial).toUpperCase();
  }
  logout(): void {
    console.log('Usuario ha cerrado sesión.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
