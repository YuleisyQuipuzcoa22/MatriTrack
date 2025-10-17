import { Component, OnInit } from '@angular/core';
import { PacienteData } from '../../../Paciente/model/paciente-historial';
import { PacienteService } from '../../../Paciente/services/paciente.service';
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
  historialesFiltrados: Historialmedico[] = [];
  conteoResultados: number = 0;
  filtroNombreApellido: string = '';
  filtroDNI: string = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  hayFiltroActivo: boolean = false;
  pacienteSeleccionado: Historialmedico | null = null;

  constructor(private pacienteService: PacienteService) {}
  ngOnInit(): void {
    this.cargarPacientes(); // Carga la lista de pacientes desde el backend
  }
  cargarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.historialData = data as Historialmedico[];
        this.filtrarPacientes();
      },
      error: (err) => {
        console.error('Error al cargar la lista de pacientes:', err);
      },
    });
  }
  filtrarPacientes(): void {
    const nombreApellido = this.filtroNombreApellido.toLowerCase().trim();
    const dni = this.filtroDNI.toLowerCase().trim();
    const estado = this.filtroEstado;
    this.historialesFiltrados = this.historialData.filter((paciente) => {
      const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
      const cumpleNombreApellido = nombreCompleto.includes(nombreApellido);
      const cumpleDNI = paciente.dni.toLowerCase().includes(dni);
      const cumpleEstado = estado === 'todos' ? true : paciente.estado === estado;
      return cumpleNombreApellido && cumpleDNI && cumpleEstado;
    });
    this.conteoResultados = this.historialesFiltrados.length;
    this.actualizarBotonLimpiar();
  }
  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo =
      !!this.filtroNombreApellido || !!this.filtroDNI || this.filtroEstado !== 'todos';
  }
  limpiarFiltros(): void {
    this.filtroNombreApellido = '';
    this.filtroDNI = '';
    this.filtroEstado = 'todos';
    this.filtrarPacientes();
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
}
