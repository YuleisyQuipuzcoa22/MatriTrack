import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Programapuerperio, ProgramapuerperioData } from '../../service/programapuerperio.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-programapuerperio',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listar-programapuerperio.html',
  styleUrl: './listar-programapuerperio.css',
  standalone: true,
})
export class ListarProgramapuerperio implements OnInit {
  programas: ProgramapuerperioData[] = [];
  filtrados: ProgramapuerperioData[] = [];

  // filtros
  filtroId: string = '';
  filtroHistorial: string = '';
  filtroEstado: string = 'todos';

  programaSeleccionado: ProgramapuerperioData | null = null;

  constructor(private service: Programapuerperio, private router: Router) {}

  ngOnInit(): void {
    this.service.listarProgramas().subscribe((data) => {
      this.programas = data;
      this.aplicarFiltros();
    });
  }

  // Handler para botón Agregar (actualmente placeholder)
  agregar(): void {
    this.router.navigate(['puerperio', 'crear']);
  }

  // Handler para abrir la vista de controles (placeholder)
  abrirControles(id: string): void {
    // Navega a la página de controles para el programa
    this.router.navigate(['puerperio', id, 'controles']);
  }

  aplicarFiltros() {
    const id = this.filtroId.trim().toLowerCase();
    const historial = this.filtroHistorial.trim().toLowerCase();
    const estado = this.filtroEstado;

    this.filtrados = this.programas.filter((p) => {
      const matchesId = p.id_programapuerperio.toLowerCase().includes(id);
      const matchesHist = p.HistorialMedico_id_historialmedico.toLowerCase().includes(historial);
      const matchesEstado = estado === 'todos' || p.estado === estado;
      return matchesId && matchesHist && matchesEstado;
    });
  }

  limpiarFiltros() {
    this.filtroId = '';
    this.filtroHistorial = '';
    this.filtroEstado = 'todos';
    this.aplicarFiltros();
  }

  // Helpers para badges y texto de estado
  getEstadoClase(estado: string): string {
    return estado === 'A' ? 'badge-estado A' : 'badge-estado I';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }

  mostrarInfo(id: string) {
    this.programaSeleccionado = this.programas.find((p) => p.id_programapuerperio === id) || null;
  }

  editar(id: string) {
    // Navega a la ruta de edición relativa (ajusta si la ruta es diferente)
    this.router.navigate(['puerperio', 'editar', id]);
  }
}
