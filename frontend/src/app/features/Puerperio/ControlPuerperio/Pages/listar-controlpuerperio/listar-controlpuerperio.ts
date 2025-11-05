// src/app/features/Puerperio/ControlPuerperio/Pages/listar-controlpuerperio.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // RouterLink se mantiene por si lo usas
import { ControlpuerperioService } from '../../service/controlpuerperio.service'; // <-- CORREGIDO
import { ControlPuerperio } from '../../model/controlpuerperio.model'; // <-- CORREGIDO

@Component({
  selector: 'app-listar-controlpuerperio',
  standalone: true,
  imports: [CommonModule, FormsModule,], // <-- CORREGIDO: RouterLink se mantiene por si acaso
  templateUrl: './listar-controlpuerperio.html',
  styleUrls: ['./listar-controlpuerperio.css'],
})
export class ListarControlpuerperio implements OnInit {
  programaId: string | null = null;
  controles: ControlPuerperio[] = []; // <-- CORREGIDO: Modelo correcto
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ControlpuerperioService // <-- CORREGIDO: Servicio correcto
  ) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    if (this.programaId) {
      this.cargarControles(this.programaId);
    }
  }

  cargarControles(programaId: string): void {
    this.isLoading = true;
    this.service.listarControlesPorPrograma(programaId).subscribe({
      next: (data: ControlPuerperio[]) => { // <-- CORREGIDO: Tipo de dato
        this.controles = data;
        this.isLoading = false;
      },
      error: (err: any) => { // <-- CORREGIDO: Tipado
        console.error('Error al cargar controles:', err);
        alert('Error al cargar controles: ' + (err.error?.message || 'Error de servidor'));
        this.isLoading = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/puerperio']);
  }

  crearControl(): void {
    if (this.programaId) {
      this.router.navigate(['/puerperio', this.programaId, 'controles', 'crear']);
    }
  }

  editarControl(cid: string): void {
    if (this.programaId) {
      this.router.navigate([
        '/puerperio',
        this.programaId,
        'controles',
        'editar',
        cid,
      ]);
    }
  }

  verAnalisis(cid: string): void {
    if (this.programaId) {
      this.router.navigate([
        '/puerperio',
        this.programaId,
        'controles',
        cid,
        'analisis',
      ]);
    }
  }
}