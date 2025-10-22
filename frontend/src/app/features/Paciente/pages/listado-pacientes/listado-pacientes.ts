import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PacienteFilters, PacienteService } from '../../services/paciente.service';
import { PacienteData } from '../../model/paciente-historial';

//usar interfaz PacienteData del servicio para consistencia

@Component({
  selector: 'app-listado-pacientes',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './listado-pacientes.html',
  styleUrl: './listado-pacientes.css',
})
export class ListadoPacientes implements OnInit {
  pacientes: PacienteData[] = [];
  pacienteSeleccionado: PacienteData | null = null;
  // Paginación
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;
  public Math = Math;
  conteoResultados = 0; // Este debe ser 'totalItems' del backend

  // Filtros
  filtroNombreApellido = '';
  filtroDNI = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  isLoading = false;
  hayFiltroActivo = false;

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
      filters.nombre = this.filtroNombreApellido.trim();
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
        this.pacientes = response.data;
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

  // Cambiar estado (Activar/Inactivar)
  cambiarEstado(id: string, nuevoEstado: 'A' | 'I'): void {
    const paciente = this.pacientes.find((p) => p.id_paciente === id);
    const accion = nuevoEstado === 'A' ? 'activar' : 'inhabilitar';

    if (!paciente) return;

    if (confirm(`¿Estás seguro de ${accion} a ${paciente.nombre} ${paciente.apellido}?`)) {
      if (nuevoEstado === 'I') {
        this.pacienteService.inhabilitarPaciente(id).subscribe({
          next: () => {
            console.log('Paciente inhabilitado');
            this.cargarPacientes();
          },
          error: (err) => console.error('Error al inhabilitar:', err),
        });
      } else {
        // Para activar, usamos modificarPaciente
        this.pacienteService.modificarPaciente(id, { estado: 'A' }).subscribe({
          next: () => {
            console.log('Paciente activado');
            this.cargarPacientes();
          },
          error: (err) => console.error('Error al activar:', err),
        });
      }
    }
  }

  // Mostrar información en modal
  mostrarInfoPaciente(id: string): void {
    this.pacienteSeleccionado = this.pacientes.find((p) => p.id_paciente === id) || null;
  }

  // Obtener clase CSS según estado
  getEstadoClase(estado: string): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }
  // Obtener texto según estado
  getEstadoTexto(estado: string): string {
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
