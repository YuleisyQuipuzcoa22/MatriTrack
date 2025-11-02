// src/app/features/Puerperio/ProgramaPuerperio/Pages/listar-programapuerperio.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ProgramapuerperioService,
  ProgramaPuerperioFilters,
} from '../../service/programapuerperio.service';
import {
  ProgramaPuerperio,
  MotivoFinPuerperio,
} from '../../model/programapuerperio.model';
import { Paginacion } from '../../../../../components/paginacion/paginacion';

@Component({
  selector: 'app-listar-programapuerperio',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink, Paginacion],
  templateUrl: './listar-programapuerperio.html',

  // ===================================================================
  // CORRECCIÓN PRINCIPAL:
  // Se usa 'styleUrls' (plural) para heredar los estilos de Diagnóstico
  // ===================================================================
  styleUrls: [
    // 5 niveles para salir de 'features/Puerperio/ProgramaPuerperio/Pages'
    '../../../../../styles/styleListadoCRUD.css',
    // 5 niveles para encontrar los estilos de Diagnóstico
    '../../../../ProgramaDiagnostico/pages/programa-diagnostico-list.component/programa-diagnostico-list.component.css',
    // El archivo CSS propio para Puerperio
    './listar-programapuerperio.css' 
  ],
  // -------------------------------------------------------------------
})
export class ListarProgramapuerperio implements OnInit {
  // Listado
  programas: ProgramaPuerperio[] = [];
  programaSeleccionado: ProgramaPuerperio | null = null;
  programaAFinalizar: ProgramaPuerperio | null = null;

  // Paginación
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;

  // Filtros
  filtroNombreApellido = '';
  filtroDNI = '';
  filtroEstadoPaciente: 'todos' | 'ACTIVO' | 'INACTIVO' = 'todos';
  filtroEstadoPrograma: 'todos' | 'ACTIVO' | 'FINALIZADO' = 'todos';

  // Estado UI
  isLoading = false;
  hayFiltroActivo = false;

  // Modal Finalizar
  motivoFinalizacion: MotivoFinPuerperio | '' = '';
  motivoOtros = '';
  isFinalizando = false;

  constructor(
    private programaService: ProgramapuerperioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProgramas();
  }

  cargarProgramas(): void {
    this.isLoading = true;
    const filters: ProgramaPuerperioFilters = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    if (this.filtroNombreApellido.trim()) {
      filters.nombreApellido = this.filtroNombreApellido.trim();
    }
    if (this.filtroDNI.trim()) {
      filters.dni = this.filtroDNI.trim();
    }
    if (this.filtroEstadoPaciente !== 'todos') {
      filters.estadoPaciente = this.filtroEstadoPaciente;
    }
    if (this.filtroEstadoPrograma !== 'todos') {
      filters.estadoPrograma = this.filtroEstadoPrograma;
    }

    this.programaService.listarProgramas(filters).subscribe({
      next: (response) => {
        this.programas = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.currentPage = response.meta.page;
        this.actualizarBotonLimpiar();
        this.isLoading = false;
      },
      error: (err: any) => { 
        console.error('Error al cargar programas:', err);
        this.isLoading = false;
      },
    });
  }

  filtrarProgramas(): void {
    this.currentPage = 1;
    this.cargarProgramas();
  }

  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido.trim() ||
      !!this.filtroDNI.trim() ||
      this.filtroEstadoPaciente !== 'todos' ||
      this.filtroEstadoPrograma !== 'todos';
  }

  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstadoPaciente = 'todos';
    this.filtroEstadoPrograma = 'todos';
    this.currentPage = 1;
    this.cargarProgramas();
  }

  mostrarInfo(id: string): void {
    this.programaSeleccionado =
      this.programas.find((p) => p.id_programapuerperio === id) || null;
  }

  abrirControles(id: string): void {
    this.router.navigate(['/puerperio', id, 'controles']);
  }

  // --- Lógica de Acciones (Finalizar / Reactivar) ---

  abrirModalFinalizar(programa: ProgramaPuerperio): void {
    if (programa.estado === 'A') {
      this.programaAFinalizar = programa;
      this.motivoFinalizacion = '';
      this.motivoOtros = '';
    }
  }

  finalizarPrograma(): void {
    if (!this.programaAFinalizar || !this.motivoFinalizacion) {
      alert('Debe seleccionar un motivo de finalización');
      return;
    }

    if (
      this.motivoFinalizacion === MotivoFinPuerperio.OTROS &&
      !this.motivoOtros.trim()
    ) {
      alert('Debe especificar el motivo cuando selecciona "Otros"');
      return;
    }

    if (
      confirm(
        `¿Está seguro de finalizar el programa de ${this.programaAFinalizar.paciente?.nombre}?`
      )
    ) {
      this.isFinalizando = true;

      const dto = {
        motivo_finalizacion: this.motivoFinalizacion,
        ...(this.motivoFinalizacion === MotivoFinPuerperio.OTROS && {
          motivo_otros: this.motivoOtros.trim(),
        }),
      };

      this.programaService
        .finalizar(this.programaAFinalizar.id_programapuerperio, dto)
        .subscribe({
          next: () => {
            this.isFinalizando = false;
            this.cerrarModalFinalizar();
            this.cargarProgramas();
            alert('Programa finalizado con éxito');
          },
          error: (err: any) => { 
            console.error('Error al finalizar programa:', err);
            this.isFinalizando = false;
            alert(err.error?.message || 'Error al finalizar el programa');
          },
        });
    }
  }

  cerrarModalFinalizar(): void {
    this.programaAFinalizar = null;
    this.motivoFinalizacion = '';
    this.motivoOtros = '';
    // Cerrar el modal usando Bootstrap
    const modal = document.getElementById('modalFinalizarPuerperio'); 
    if (modal) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        const closeButton = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }
  }

  reactivarPrograma(programa: ProgramaPuerperio): void {
    if (programa.estado !== 'A') {
      if (
        confirm(
          `¿Está seguro de reactivar el programa de ${programa.paciente?.nombre}?`
        )
      ) {
        this.programaService.activar(programa.id_programapuerperio).subscribe({
          next: () => {
            this.cargarProgramas();
            alert('Programa reactivado con éxito');
          },
          error: (err: any) => { 
            console.error('Error al reactivar programa:', err);
            alert(err.error?.message || 'Error al reactivar el programa');
          },
        });
      }
    }
  }

  // --- Helpers ---

  getEstadoClase(estado: string): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'A' ? 'ACTIVO' : 'FINALIZADO';
  }

  getMotivoFinTexto(motivo: MotivoFinPuerperio | null): string {
    if (!motivo) return 'No especificado';
    const motivos: Record<MotivoFinPuerperio, string> = {
      [MotivoFinPuerperio.ALTA_MEDICA]: 'Alta Médica',
      [MotivoFinPuerperio.VOLUNTAD_PACIENTE]: 'Voluntad del Paciente',
      [MotivoFinPuerperio.OTROS]: 'Otros',
    };
    return motivos[motivo] || motivo;
  }

  // --- Paginación ---

  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarProgramas();
  }

  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.cargarProgramas();
  }

  // Getter para el enum (para usar en el template)
  get MotivoFinPuerperio() {
    return MotivoFinPuerperio;
  }
}