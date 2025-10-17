import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { PacienteData } from '../../model/paciente-historial';

//usar interfaz PacienteData del servicio para consistencia
interface Paciente extends PacienteData {}

@Component({
  selector: 'app-listado-pacientes',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './listado-pacientes.html',
  styleUrl: './listado-pacientes.css',
})
export class ListadoPacientes implements OnInit {
  pacientesData: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  conteoResultados: number = 0; // Modelos para el NgModel (filtros)
  filtroNombreApellido: string = '';
  filtroDNI: string = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  hayFiltroActivo: boolean = false;
  pacienteSeleccionado: Paciente | null = null;
  constructor(private pacienteService: PacienteService) {}
  ngOnInit(): void {
    this.cargarPacientes(); // Carga la lista de pacientes desde el backend
  }

  cargarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacientesData = data as Paciente[];
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
    this.pacientesFiltrados = this.pacientesData.filter((paciente) => {
      const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
      const cumpleNombreApellido = nombreCompleto.includes(nombreApellido);
      const cumpleDNI = paciente.dni.toLowerCase().includes(dni);
      const cumpleEstado = estado === 'todos' ? true : paciente.estado === estado;
      return cumpleNombreApellido && cumpleDNI && cumpleEstado;
    });
    this.conteoResultados = this.pacientesFiltrados.length;
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
  cambiarEstado(id: string, nuevoEstado: 'A' | 'I'): void {
    const paciente = this.pacientesData.find((p) => p.id_paciente === id);
    const accion = nuevoEstado === 'A' ? 'Activar' : 'Inhabilitar';

    if (
      paciente &&
      confirm(
        `¿Estás seguro de que deseas ${accion} al paciente ${paciente.nombre} ${paciente.apellido}?`
      )
    ) {
      if (nuevoEstado === 'I') {
        this.pacienteService.inhabilitarPaciente(id).subscribe({
          next: () => {
            this.cargarPacientes();
          },
          error: (err) => {
            console.error(`Error al inhabilitar al paciente:`, err);
          },
        });
      } else if (nuevoEstado === 'A') {
        this.pacienteService.modificarPaciente(id, { estado: 'A' }).subscribe({
          next: () => {
            this.cargarPacientes();
          },
          error: (err) => {
            console.error(`Error al activar al paciente:`, err);
          },
        });
      }
    }
  }
  mostrarInfoPaciente(id: string): void {
    this.pacienteSeleccionado = this.pacientesData.find((p) => p.id_paciente === id) || null;
  }
  getEstadoClase(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }
  getEstadoTexto(estado: 'A' | 'I'): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }
}
