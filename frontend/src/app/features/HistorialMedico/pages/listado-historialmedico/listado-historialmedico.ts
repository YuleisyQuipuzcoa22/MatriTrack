import { Component, OnInit } from '@angular/core';
import { PacienteData } from '../../../Paciente/model/paciente-historial';
import { PacienteFilters, PacienteService } from '../../../Paciente/services/paciente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paginacion } from '../../../../components/paginacion/paginacion';
import { HistorialmedicoService } from '../../services/historialmedico.service';
declare var bootstrap: any;

// Segun la interfaz, paciente tiene toda la info del historial medico
interface Historialmedico extends PacienteData {}

@Component({
  selector: 'app-listado-historialmedico',
  imports: [FormsModule, CommonModule, RouterLink, Paginacion],
  templateUrl: './listado-historialmedico.html',

  styleUrls: ['../../../../styles/styleListadoCRUD.css', './listado-historialmedico.css'],
})
export class ListadoHistorialmedico implements OnInit {
  historialData: Historialmedico[] = [];
  pacienteSeleccionado: Historialmedico | null = null;

   historialEditando: {
    id_historialmedico: string;
    antecedente_medico: string;
    alergia: string;
    tipo_sangre: string;
  } | null = null;

  tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  isGuardando = false;

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

  constructor(
    private pacienteService: PacienteService,
    private historialService: HistorialmedicoService
  ) {}
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
  abrirModalEdicion(id_paciente: string): void {
    const paciente = this.historialData.find((p) => p.id_paciente === id_paciente);
    if (paciente && paciente.historial_medico) {
      this.historialEditando = {
        id_historialmedico: paciente.historial_medico.id_historialmedico,
        antecedente_medico: paciente.historial_medico.antecedente_medico || '',
        alergia: paciente.historial_medico.alergia || '',
        tipo_sangre: paciente.historial_medico.tipo_sangre,
      };
    }
  }
  guardarCambiosHistorial(): void {
    if (!this.historialEditando) return;

    this.isGuardando = true;

    const dataToUpdate = {
      antecedente_medico: this.historialEditando.antecedente_medico || undefined,
      alergia: this.historialEditando.alergia || undefined,
      tipo_sangre: this.historialEditando.tipo_sangre,
    };

    this.historialService
      .updateHistorialMedico(this.historialEditando.id_historialmedico, dataToUpdate)
      .subscribe({
        next: (response) => {
          // Actualizar los datos
          this.cargarPacientes();
          this.isGuardando = false;
          
          // Cerrar el modal
          const modalElement = document.getElementById('modalEditarHistorial');
          const modal = bootstrap.Model.getInstance(modalElement!);
          modal?.hide();
          
          // Opcional: Mostrar mensaje de éxito
          alert('Historial médico actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error al actualizar historial médico:', err);
          this.isGuardando = false;
          alert('Error al actualizar el historial médico');
        },
      });
  }

  //Cancelar edición
  cancelarEdicion(): void {
    this.historialEditando = null;
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
