import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleAnalisisService, DetalleAnalisisData } from '../services/detalle-analisis.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-detalle-analisis',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './listar-detalles-analisis.html',
  styleUrls: ['./listar-detalles-analisis.css']
})
export class ListarDetalleAnalisis implements OnInit {

  detalles: DetalleAnalisisData[] = [];
  filtrados: DetalleAnalisisData[] = [];

  busqueda: string = '';
  filtroTipo: string = '';

  detalleSeleccionado?: DetalleAnalisisData;

  constructor(private detalleService: DetalleAnalisisService) {}

  tiposAnalisis: string[] = [];

  ngOnInit(): void {
    this.detalleService.listarDetalles().subscribe(data => {
      this.detalles = data;
      this.filtrados = data;

      // Crear lista de tipos únicos para el combobox
      this.tiposAnalisis = Array.from(new Set(data.map(d => d.tipoAnalisis)));
  });
}

agregar(): void {
  console.log('Redirigir a la página de creación...');
  // window.location.href = '/ruta/nueva'; // o usar Router.navigate
}

  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda = input.value;
    this.filtrar();
  }

  actualizarFiltroTipo(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroTipo = input.value;
    this.filtrar();
  }

  filtrar(): void {
    const query = this.busqueda.trim().toLowerCase();
    const tipo = this.filtroTipo.trim().toLowerCase();

    this.filtrados = this.detalles.filter(det =>
      (!tipo || det.tipoAnalisis.toLowerCase().includes(tipo))
    );
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.filtroTipo = '';
    this.filtrados = this.detalles;
  }

  verDetalle(detalle: DetalleAnalisisData): void {
    this.detalleSeleccionado = detalle;
  }

  abrirPDF(ruta: string): void {
    // Abrir el PDF en la misma pestaña
    window.open(ruta, '_self');
  }

  puedeEditar(detalle: DetalleAnalisisData): boolean {
    return !detalle.expirado;
  }
}
