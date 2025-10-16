import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserObstetraService, UserData } from '../../services/user-obstetra.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router'; // Aseguramos que RouterOutlet no esté importado si no se usa

// Usaremos la interfaz UserData del servicio para consistencia
interface Obstetra extends UserData {}

@Component({
  selector: 'app-listado-obstetras', // Aseguramos que HttpClientModule esté disponible para usar el servicio
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
  templateUrl: './listado-obstetras.html',
  styleUrl: './listado-obstetras.css',
  standalone: true, // Asumimos que es un componente standalone
})
export class ListadoObstetras implements OnInit {
  // Datos ya no son de simulación, se inicializan vacíos
  obstetrasData: Obstetra[] = [];

  obstetrasFiltrados: Obstetra[] = [];
  conteoResultados: number = 0; // Modelos para el NgModel (filtros)

  filtroNombreApellido: string = '';
  filtroDNI: string = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos'; // Control de interfaz

  hayFiltroActivo: boolean = false;
  obstetraSeleccionado: Obstetra | null = null;

  constructor(
    private obstetraService: UserObstetraService // Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    this.cargarObstetras(); // Carga la lista de obstetras desde el backend
  }
  /**
   * Carga la lista de obstetras y administradores desde el backend.
   */

  cargarObstetras(): void {
    this.obstetraService.listarObstetras().subscribe({
      next: (data) => {
        this.obstetrasData = data as Obstetra[];
        this.filtrarObstetras(); // Aplicamos filtros iniciales (que será el listado completo)
      },
      error: (err) => {
        console.error('Error al cargar la lista de obstetras:', err); // NOTA: Aquí deberías usar un modal o snackbar en lugar de alert() // alert('Error al cargar los usuarios. Verifique la conexión con el servidor.');
      },
    });
  }
  /**
   * Aplica todos los filtros a la lista de obstetras y actualiza la vista.
   */

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
  /**
   * Determina si se debe mostrar el botón de "Borrar Filtros".
   */

  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido || !!this.filtroDNI || this.filtroEstado !== 'todos';
  }
  /**
   * Limpia todos los campos de filtro y refresca la lista.
   */

  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstado = 'todos';
    this.filtrarObstetras();
  }  // --- Funciones de Acción ---
  /**
   * Llama al endpoint de inhabilitación o reactivación en el backend.
   * @param id ID del usuario a modificar.
   * @param nuevoEstado El estado deseado ('A' para activo, 'I' para inactivo).
   */

  cambiarEstado(id: string, nuevoEstado: 'A' | 'I'): void {
    const obstetra = this.obstetrasData.find((o) => o.id_usuario === id);
    const accion = nuevoEstado === 'A' ? 'Activar' : 'Inactivar'; // NOTA: Aquí deberías usar un modal de confirmación en lugar de confirm()

    if (
      obstetra &&
      confirm(`¿Está seguro que desea ${accion} a ${obstetra.nombre} ${obstetra.apellido}?`)
    ) {
      if (nuevoEstado === 'I') {
        // RF8: Inhabilitar (usa el endpoint PUT /:id/inhabilitar)
        this.obstetraService.inhabilitarUsuario(id).subscribe({
          next: () => {
            console.log(`Usuario ${id} inhabilitado correctamente.`);
            this.cargarObstetras(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al inhabilitar usuario:', err); // alert('Error al inhabilitar el usuario. Verifique el log.');
          },
        });
      } else if (nuevoEstado === 'A') {
        // Para activar, usamos el método de modificación general (PUT /:id), enviando el nuevo estado
        this.obstetraService.modificarUsuario(id, { estado: 'A' }).subscribe({
          next: () => {
            console.log(`Usuario ${id} activado correctamente.`);
            this.cargarObstetras(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al activar usuario:', err); // alert('Error al activar el usuario. Verifique el log.');
          },
        });
      }
    }
  }

  mostrarInfo(id: string): void {
    this.obstetraSeleccionado = this.obstetrasData.find((o) => o.id_usuario === id) || null; // La lógica de mostrar el modal de Bootstrap se maneja en el HTML con data-bs-toggle
  } // --- Helpers para la plantilla ---

  getEstadoClase(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }

  getEstadoTexto(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }
}
