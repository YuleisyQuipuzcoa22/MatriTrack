import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DetalleAnalisisService, DetalleAnalisisData } from '../services/detalle-analisis.service';

@Component({
  selector: 'app-editar-detalle-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-detalle-analisis.html',
  styleUrls: ['./editar-detalle-analisis.css']
})
export class EditarDetalleAnalisis {
  id: string | null = null;
  detalle: DetalleAnalisisData | null = null;

  // propiedades enlazadas
  tipoAnalisis = '';
  fechaRealizacion: string | null = null;
  fechaRegistroLocal: string | null = null; // datetime-local
  laboratorio = '';
  resultado = '';
  observaciones = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detalleService: DetalleAnalisisService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.cargarDetalle(this.id);
    }
  }

  cargarDetalle(id: string): void {
    this.detalleService.getDetalleById(id).subscribe(d => {
      if (!d) { return; }
      this.detalle = d;
      this.tipoAnalisis = d.tipoAnalisis;
      this.fechaRealizacion = d.fechaRealizacion;
      // convertir fechaRegistro ISO a datetime-local (sin zona)
      const fecha = new Date(d.fechaRegistro);
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      const hh = String(fecha.getHours()).padStart(2, '0');
      const min = String(fecha.getMinutes()).padStart(2, '0');
      this.fechaRegistroLocal = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
      this.laboratorio = d.laboratorio;
      this.resultado = d.resultado;
      this.observaciones = d.observaciones;
    });
  }


  guardar(): void {
    if (!this.id) { return; }
    // truncar campos por seguridad
    this.resultado = this.resultado ? this.resultado.slice(0,200) : '';
    this.observaciones = this.observaciones ? this.observaciones.slice(0,200) : '';

    const cambios: Partial<DetalleAnalisisData> = {
      tipoAnalisis: this.tipoAnalisis,
      fechaRealizacion: this.fechaRealizacion ?? new Date().toISOString().slice(0,10),
      fechaRegistro: this.fechaRegistroLocal ? new Date(this.fechaRegistroLocal).toISOString() : new Date().toISOString(),
      laboratorio: this.laboratorio,
      resultado: this.resultado,
      observaciones: this.observaciones
    };

    this.detalleService.actualizarDetalle(this.id, cambios).subscribe(res => {
      console.log('Detalle actualizado (mock):', res);
      this.router.navigate(['/detalles']);
    });
  }
}
