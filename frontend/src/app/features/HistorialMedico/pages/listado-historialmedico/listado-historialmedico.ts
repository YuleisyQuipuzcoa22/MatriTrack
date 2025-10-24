import { Component, OnInit } from '@angular/core';
import { PacienteData } from '../../../Paciente/model/paciente-historial';
import { PacienteFilters, PacienteService } from '../../../Paciente/services/paciente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paginacion } from '../../../../components/paginacion/paginacion';

// Segun la interfaz, paciente tiene toda la info del historial medico
interface Historialmedico extends PacienteData {}

@Component({
  selector: 'app-listado-historialmedico',
  imports: [FormsModule, CommonModule, RouterLink, Paginacion],
  templateUrl: './listado-historialmedico.html',
  styleUrl: './listado-historialmedico.css',
  // Es necesario que PacienteService sea provisto aquí si es standalone
})
export class ListadoHistorialmedico implements OnInit {
  historialData: Historialmedico[] = [];
  pacienteSeleccionado: Historialmedico | null = null;

  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;
  conteoResultados = 0;

  filtroNombreApellido = '';
  filtroDNI = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  isLoading = false;
  hayFiltroActivo = false;

  constructor(private pacienteService: PacienteService) {}
  ngOnInit(): void {
    this.cargarPacientes();
  }
  cargarPacientes(): void {
    this.isLoading = true;

    const filters: PacienteFilters = {
      page: this.currentPage,
      limit: this.pageSize,
    };
    if (this.filtroNombreApellido.trim()) {
      filters.nombreApellido = this.filtroNombreApellido.trim();
    }
    if (this.filtroDNI.trim()) {
      filters.dni = this.filtroDNI.trim();
    }
    if (this.filtroEstado !== 'todos') {
      filters.estado = this.filtroEstado;
    }
     
    this.pacienteService.listarPacientes(filters).subscribe({
      next: (response) => {
        this.historialData = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.currentPage = response.meta.page;
        this.conteoResultados = this.totalItems;
        this.actualizarBotonLimpiar();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.isLoading = false;
      },
    });
  }

  filtrarPacientes(): void {
    this.currentPage = 1; // Reiniciar a página 1 cuando cambian filtros
    this.cargarPacientes();
  } // Actualizar estado del botón "Limpiar filtros"
  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido.trim() ||
      !!this.filtroDNI.trim() ||
      this.filtroEstado !== 'todos';
  } // Limpiar todos los filtros
  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstado = 'todos';
    this.currentPage = 1;
    this.cargarPacientes();
  } // Navegar entre páginas

  mostrarInfoHistorial(id: string): void {
    this.pacienteSeleccionado = this.historialData.find((p) => p.id_paciente === id) || null;
  }

  getEstadoClase(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }
  getEstadoTexto(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }
  getSexoTexto(sexoCode: 'M' | 'F'): string {
    switch (sexoCode) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Femenino';
      default:
        return 'No especificado';
    }
  }
  // Navegar entre páginas
  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarPacientes();
  }
  // Cambiar tamaño de página
  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Siempre ir a la página 1 al cambiar el límite
    this.cargarPacientes();
  }
}
