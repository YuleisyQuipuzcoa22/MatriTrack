// src/app/features/Puerperio/ControlPuerperio/Pages/listar-controlpuerperio.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ControlpuerperioService, ControlPuerperioFilters } from '../../service/controlpuerperio.service'; // 1. Importar Filtros
import { ControlPuerperio } from '../../model/controlpuerperio.model';
import { ProgramaPuerperio } from '../../../ProgramaPuerperio/model/programapuerperio.model';
import { ProgramapuerperioService } from '../../../ProgramaPuerperio/service/programapuerperio.service';
import { Paginacion } from '../../../../../components/paginacion/paginacion'; // 2. Importar Paginacion

@Component({
  selector: 'app-listar-controlpuerperio',
  standalone: true,
  imports: [CommonModule, FormsModule, Paginacion], // 3. Añadir Paginacion
  templateUrl: './listar-controlpuerperio.html',
  styleUrls: ['./listar-controlpuerperio.css'],
})
export class ListarControlpuerperio implements OnInit {
  programaId: string | null = null;
  nombrePaciente: string = '';
  controles: ControlPuerperio[] = [];
  isLoading = false;

  // 4. Añadir propiedades de Paginación y Filtros
  currentPage = 1;
  pageSize = 10; // Empezar con 10
  totalItems = 0;
  totalPages = 0;

  filtroFechaInicio: string = ''; // Usar string vacío
  filtroFechaFin: string = '';   // Usar string vacío
  hayFiltroActivo = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ControlpuerperioService,
    private programaService: ProgramapuerperioService
  ) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    if (this.programaId) {
      this.cargarControles(); // 5. Cargar controles
      this.obtenerPacientePrograma(this.programaId);
    }
  }

  // 6. Modificar cargarControles
  cargarControles(): void {
    if (!this.programaId) return;

    this.isLoading = true;
    this.actualizarBotonLimpiar();

    const filters: ControlPuerperioFilters = {
      page: this.currentPage,
      limit: this.pageSize,
      fechaInicio: this.filtroFechaInicio || undefined,
      fechaFin: this.filtroFechaFin || undefined,
      order: 'DESC',
    };

    this.service.listarControlesPorPrograma(this.programaId, filters).subscribe({
      next: (response) => { 
        this.controles = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.currentPage = response.meta.page;
        this.isLoading = false;
      },
      error: (err: any) => { 
        console.error('Error al cargar controles:', err);
        alert('Error al cargar controles: ' + (err.error?.message || 'Error de servidor'));
        this.isLoading = false;
      },
    });
  }
  
  private obtenerPacientePrograma(programaId: string): void {
    this.programaService.getProgramaById(programaId).subscribe({
      next: (programa: ProgramaPuerperio) => {
        if (programa.paciente) {
          this.nombrePaciente = programa.paciente.nombre + ' ' + programa.paciente.apellido;
        }
      },
    });
  }

  // 7. Añadir nuevos métodos
  filtrarPorFecha(): void {
    if (this.filtroFechaInicio && this.filtroFechaFin && this.filtroFechaInicio > this.filtroFechaFin) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }
    this.currentPage = 1;
    this.cargarControles();
  }

  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo = !!this.filtroFechaInicio || !!this.filtroFechaFin;
  }

  limpiarFiltros(): void {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.currentPage = 1;
    this.cargarControles();
  }

  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarControles();
  }

  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.cargarControles();
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
      this.router.navigate(['/puerperio', this.programaId, 'controles', 'editar', cid]);
    }
  }

  verAnalisis(cid: string): void {
    if (this.programaId) {
      this.router.navigate(['/puerperio', this.programaId, 'controles', cid, 'analisis']);
    }
  }
}