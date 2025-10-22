import { Component, OnInit } from '@angular/core';
import { PacienteData } from '../../../Paciente/model/paciente-historial';
import { PacienteFilters, PacienteService } from '../../../Paciente/services/paciente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

//Segun la interfaz, paciente tiene toda la info del historial medico
interface Historialmedico extends PacienteData {}
@Component({
  selector: 'app-listado-historialmedico',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './listado-historialmedico.html',
  styleUrl: './listado-historialmedico.css',
})
export class ListadoHistorialmedico implements OnInit {
  historialData: Historialmedico[] = [];
  pacienteSeleccionado: Historialmedico | null = null;
     public Math = Math;

  // Paginación
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;

  // Filtros
  filtroNombreApellido = '';
  filtroDNI = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  isLoading = false;
  hayFiltroActivo = false;
  conteoResultados = 0;

  constructor(private pacienteService: PacienteService) {}
  ngOnInit(): void {
    this.cargarPacientes(); // Carga la lista de pacientes desde el backend
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

    // Ahora envía los parámetros de paginación
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
  }
  // Actualizar estado del botón "Limpiar filtros"
  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido.trim() ||
      !!this.filtroDNI.trim() ||
      this.filtroEstado !== 'todos';
  }
  // Limpiar todos los filtros
  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstado = 'todos';
    this.currentPage = 1;
    this.cargarPacientes();
  }

  // Navegar entre páginas
  irAPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cargarPacientes();
    }
  }
  // Cambiar tamaño de página
 cambiarTamanoPagina(): void {
    this.currentPage = 1; // Siempre ir a la página 1 al cambiar el límite
    this.cargarPacientes();
  }
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
}
