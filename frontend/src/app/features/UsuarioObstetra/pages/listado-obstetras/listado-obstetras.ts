import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  UserObstetraService,
  UserData,
  UsuarioFilters,
} from '../../services/user-obstetra.service';

// Usaremos la interfaz UserData del servicio para consistencia
interface Obstetra extends UserData {}

@Component({
  selector: 'app-listado-obstetras',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './listado-obstetras.html',
  styleUrl: '../../../../styles/styleListadoCRUD.css',
})
export class ListadoObstetras implements OnInit {
  obstetrasData: Obstetra[] = [];
  obstetraSeleccionado: Obstetra | null = null;
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;
  public Math = Math;
  conteoResultados = 0;

  // Filtros
  filtroNombreApellido = '';
  filtroDNI = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  isLoading = false;
  hayFiltroActivo = false;

  constructor(private obstetraService: UserObstetraService) {}

  ngOnInit(): void {
    this.cargarObstetras();
  }

  cargarObstetras(): void {
    this.isLoading = true;
    const filters: UsuarioFilters = {
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

    this.obstetraService.listarObstetras(filters).subscribe({
      next: (response) => {
        this.obstetrasData = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.currentPage = response.meta.page;
        this.conteoResultados = this.totalItems;
        this.actualizarBotonLimpiar();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar obstetras:', err);
        this.isLoading = false;
      },
    });
  }

  // Aplica todos los filtros
  filtrarObstetras(): void {
    this.currentPage = 1; // Reiniciar a página 1 cuando cambian filtros
    this.cargarObstetras();
  }

  //Determina si se debe mostrar el botón de "Borrar Filtros"
  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido.trim() ||
      !!this.filtroDNI.trim() ||
      this.filtroEstado !== 'todos';
  }

  // Limpia todos los campos de filtro y refresca la lista
  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstado = 'todos';
    this.currentPage = 1;

    this.cargarObstetras();
  }
  /**
   * @param id ID del usuario a modificar.
   * @param nuevoEstado El estado deseado ('A' para activo, 'I' para inactivo).
   */

  cambiarEstado(id: string, nuevoEstado: 'A' | 'I'): void {
    const obstetra = this.obstetrasData.find((o) => o.id_usuario === id);
    const accion = nuevoEstado === 'A' ? 'Activar' : 'Inactivar';

    if (
      obstetra &&
      confirm(`¿Está seguro que desea ${accion} a ${obstetra.nombre} ${obstetra.apellido}?`)
    ) {
      if (nuevoEstado === 'I') {
        //Inhabilitar
        this.obstetraService.inhabilitarUsuario(id).subscribe({
          next: () => {
            console.log(`Usuario ${id} inhabilitado correctamente.`);
            this.cargarObstetras(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al inhabilitar usuario:', err);
          },
        });
      } else if (nuevoEstado === 'A') {
        this.obstetraService.modificarUsuario(id, { estado: 'A' }).subscribe({
          next: () => {
            console.log(`Usuario ${id} activado correctamente.`);
            this.cargarObstetras(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al activar usuario:', err);
          },
        });
      }
    }
  }

  mostrarInfo(id: string): void {
    this.obstetraSeleccionado = this.obstetrasData.find((o) => o.id_usuario === id) || null;
  }

  getEstadoClase(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }

  getEstadoTexto(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }

  // Navegar entre páginas
  irAPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cargarObstetras();
    }
  }
  // Cambiar tamaño de página o sea mostrar 9,10,20
  cambiarTamanoPagina(): void {
    this.currentPage = 1; // Siempre ir a la página 1 al cambiar el límite
    this.cargarObstetras();
  }
}
