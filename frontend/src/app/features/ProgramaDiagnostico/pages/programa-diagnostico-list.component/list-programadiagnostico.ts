import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Para la navegación
import {
  ProgramaDiagnosticoFilters,
  ProgramaDiagnosticoService,
} from '../../services/programadiagnostico.service'; // Asegúrate de la ruta correcta
import { ProgramaDiagnostico, Estado } from '../../model/programadiagnostico';
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

  // Paginación
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;
  conteoResultados = 0;

  filtroNombreApellido = '';
  filtroDNI = '';
  filtroEstadoPaciente: 'todos' | 'ACTIVO' | 'INACTIVO' = 'todos';
  filtroEstadoPrograma: 'todos' | 'ACTIVO' | 'FINALIZADO' = 'todos';

  // Estado de la UI
  isLoading = false;
  hayFiltroActivo = false;

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
        this.conteoResultados = this.totalItems;
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

  //mostrar info
  mostrarInfoPrograma(id: string): void {
    this.programaSeleccionado = this.programas.find((p) => p.id_programadiagnostico === id) || null;
  }

  getEstadoClase(estado: string): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }
  // Obtener texto según estado
  getEstadoTexto(estado: string): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }

  /*

  handleCloseDetalleModal(): void {
    this.showDetalleModal = false;
    this.programaToDetail = null;
  }*/

  // 2. Finalizar Programa (Muestra el modal)
  abrirModalFinalizar(programa: ProgramaDiagnostico): void {
    // Solo permitir finalizar si el estado es ACTIVO
    if (programa.estado === 'ACTIVO') {
    }
  }

  // 3. Maneja la finalización exitosa (Recarga la lista)
  handleFinalizacionExitosa(): void {
    this.cargarProgramas();
  }
  /*
  // 4. Editar Programa (Navegación)
  editarPrograma(programa: ProgramaDiagnostico): void {
    // Solo permitir editar si el estado es ACTIVO
    if (programa.estado === Estado.ACTIVO) {
      this.router.navigate(['/programas/editar', programa.id_programadiagnostico]);
    } else {
      alert('Solo se pueden editar programas con estado ACTIVO.');
    }
  }*/

  // 5. Activar/Habilitar Programa (Acción directa)
  reactivarPrograma(programa: ProgramaDiagnostico): void {
    if (programa.estado !== 'ACTIVO') {
      if (confirm(`¿Está seguro de habilitar el programa de ${programa.paciente?.nombre}?`)) {
        this.programaService.activar(programa.id_programadiagnostico).subscribe({
          next: () => {
            this.cargarProgramas(); // Recargar la lista
            alert('Programa activado con éxito.');
          },
          error: (err) => {
            console.error('Error al activar programa:', err);
            alert(err.error?.message || 'Error al activar el programa.');
          },
        });
      }
    }
  }
  /*

  // 6. Ver Controles (Navegación al módulo de Controles)
  verControles(programa: ProgramaDiagnostico): void {
    this.router.navigate(['/controles-diagnostico', programa.id_programadiagnostico]);
  }

  goToRegistro(): void {
    this.router.navigate(['/diagnostico/registrar']);
  }*/

  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarProgramas();
  }
  // Cambiar tamaño de página o sea mostrar 9,10,20
  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Siempre ir a la página 1 al cambiar el límite
    this.cargarProgramas();
  }
}
