import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserObstetraService, UserData } from '../../services/user-obstetra.service';

// Usaremos la interfaz UserData del servicio para consistencia
interface Obstetra extends UserData {}

@Component({
  selector: 'app-listado-obstetras',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './listado-obstetras.html',
  styleUrl: './listado-obstetras.css',
  standalone: true,
})
export class ListadoObstetras implements OnInit {
  obstetrasData: Obstetra[] = [];

  obstetrasFiltrados: Obstetra[] = [];
  conteoResultados: number = 0; // Modelos para el NgModel (filtros)

  filtroNombreApellido: string = '';
  filtroDNI: string = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  hayFiltroActivo: boolean = false;
  obstetraSeleccionado: Obstetra | null = null;

  constructor(private obstetraService: UserObstetraService) {}

  ngOnInit(): void {
    this.cargarObstetras(); // Carga la lista de obstetras desde el backend
  }

  //Carga la lista de obstetras y administradores desde el backend.

  cargarObstetras(): void {
    this.obstetraService.listarObstetras().subscribe({
      next: (data) => {
        this.obstetrasData = data as Obstetra[];
        this.filtrarObstetras();
      },
      error: (err) => {
        console.error('Error al cargar la lista de obstetras:', err);
      },
    });
  }

  // Aplica todos los filtros a la lista de obstetras y actualiza la vista.

  filtrarObstetras(): void {
    const nombreApellido = this.filtroNombreApellido.toLowerCase().trim();
    const dni = this.filtroDNI.toLowerCase().trim();
    const estado = this.filtroEstado;

    this.obstetrasFiltrados = this.obstetrasData.filter((obstetra) => {
      const nombreCompleto = `${obstetra.nombre} ${obstetra.apellido}`.toLowerCase();

      const cumpleNombreApellido = nombreCompleto.includes(nombreApellido);
      const cumpleDNI = obstetra.dni.toLowerCase().includes(dni);
      const cumpleEstado = estado === 'todos' || obstetra.estado === estado;

      return cumpleNombreApellido && cumpleDNI && cumpleEstado;
    });

    this.conteoResultados = this.obstetrasFiltrados.length;
    this.actualizarBotonLimpiar();
  }

  //Determina si se debe mostrar el botón de "Borrar Filtros".

  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido || !!this.filtroDNI || this.filtroEstado !== 'todos';
  }

  // Limpia todos los campos de filtro y refresca la lista.

  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstado = 'todos';
    this.filtrarObstetras();
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
}
