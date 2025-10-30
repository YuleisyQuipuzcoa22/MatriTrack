import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ProgramaDiagnosticoFilters,
  ProgramaDiagnosticoService,
} from '../../services/programadiagnostico.service';
import { ProgramaDiagnostico, MotivoFin } from '../../model/programadiagnostico';
import { Paginacion } from '../../../../components/paginacion/paginacion';

@Component({
  selector: 'app-programa-diagnostico-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Paginacion],
  templateUrl: './programa-diagnostico-list.component.html',
  styleUrls: [
    '../../../../styles/styleListadoCRUD.css',
    './programa-diagnostico-list.component.css',
  ],
})
export class ProgramaDiagnosticoListComponent implements OnInit {
  // Listado principal
  programas: ProgramaDiagnostico[] = [];
  programaSeleccionado: ProgramaDiagnostico | null = null;
  programaAFinalizar: ProgramaDiagnostico | null = null;

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

  // Estado de la UI
  isLoading = false;
  hayFiltroActivo = false;

  // Formulario de finalización
  motivoFinalizacion: MotivoFin | '' = '';
  motivoOtros = '';
  isFinalizando = false;

  constructor(private programaService: ProgramaDiagnosticoService) {}

  ngOnInit(): void {
    this.cargarProgramas();
  }

  cargarProgramas(): void {
    this.isLoading = true;

    const filters: ProgramaDiagnosticoFilters = {
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
      error: (err) => {
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

  // Mostrar detalle del programa
  mostrarInfoPrograma(id: string): void {
    this.programaSeleccionado = this.programas.find((p) => p.id_programadiagnostico === id) || null;
  }

  // Obtener clase CSS según el estado
  getEstadoClase(estado: string): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }

  // Obtener texto legible del estado
  getEstadoTexto(estado: string): string {
    return estado === 'A' ? 'ACTIVO' : 'FINALIZADO';
  }

  // Obtener texto legible del motivo de finalización
  getMotivoFinTexto(motivo: MotivoFin | null): string {
    if (!motivo) return 'No especificado';
    
    const motivos: Record<MotivoFin, string> = {
      [MotivoFin.PARTO]: 'Parto',
      [MotivoFin.VOLUNTAD_PACIENTE]: 'Voluntad del Paciente',
      [MotivoFin.OTROS]: 'Otros',
    };
    
    return motivos[motivo] || motivo;
  }

  // Abrir modal de finalización
  abrirModalFinalizar(programa: ProgramaDiagnostico): void {
    if (programa.estado === 'A') {
      this.programaAFinalizar = programa;
      this.motivoFinalizacion = '';
      this.motivoOtros = '';
    }
  }

  // Finalizar programa
  finalizarPrograma(): void {
    if (!this.programaAFinalizar || !this.motivoFinalizacion) {
      alert('Debe seleccionar un motivo de finalización');
      return;
    }

    if (this.motivoFinalizacion === MotivoFin.OTROS && !this.motivoOtros.trim()) {
      alert('Debe especificar el motivo cuando selecciona "Otros"');
      return;
    }

    if (confirm(`¿Está seguro de finalizar el programa de ${this.programaAFinalizar.paciente?.nombre}?`)) {
      this.isFinalizando = true;

      const dto = {
        motivo_finalizacion: this.motivoFinalizacion,
        ...(this.motivoFinalizacion === MotivoFin.OTROS && { motivo_otros: this.motivoOtros.trim() }),
      };

      this.programaService.finalizar(this.programaAFinalizar.id_programadiagnostico, dto).subscribe({
        next: () => {
          this.isFinalizando = false;
          this.cerrarModalFinalizar();
          this.cargarProgramas();
          alert('Programa finalizado con éxito');
        },
        error: (err) => {
          console.error('Error al finalizar programa:', err);
          this.isFinalizando = false;
          alert(err.error?.message || 'Error al finalizar el programa');
        },
      });
    }
  }

  // Cerrar modal de finalización
  cerrarModalFinalizar(): void {
    this.programaAFinalizar = null;
    this.motivoFinalizacion = '';
    this.motivoOtros = '';
    // Cerrar el modal usando Bootstrap
    const modal = document.getElementById('modalFinalizar');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  // Reactivar programa
  reactivarPrograma(programa: ProgramaDiagnostico): void {
    if (programa.estado !== 'A') {
      if (confirm(`¿Está seguro de reactivar el programa de ${programa.paciente?.nombre}?`)) {
        this.programaService.activar(programa.id_programadiagnostico).subscribe({
          next: () => {
            this.cargarProgramas();
            alert('Programa reactivado con éxito');
          },
          error: (err) => {
            console.error('Error al reactivar programa:', err);
            alert(err.error?.message || 'Error al reactivar el programa');
          },
        });
      }
    }
  }

  // Paginación
  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarProgramas();
  }

  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.cargarProgramas();
  }

  // Getter para el enum MotivoFin (para usar en el template)
  get MotivoFin() {
    return MotivoFin;
  }
}