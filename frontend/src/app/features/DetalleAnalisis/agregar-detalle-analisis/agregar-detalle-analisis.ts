import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DetalleAnalisisService, DetalleAnalisisData } from '../services/detalle-analisis.service';

@Component({
  selector: 'app-agregar-detalle-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agregar-detalle-analisis.html',
  styleUrls: ['./agregar-detalle-analisis.css']
})
export class AgregarDetalleAnalisis {
  // propiedades enlazadas al formulario
  fechaRealizacion: string | null = null; // yyyy-mm-dd
  fechaRegistroLocal: string | null = null; // datetime-local string
  laboratorio: string = '';
  resultado: string = '';
  observaciones: string = '';
  pdfFile: File | null = null;

  constructor(private router: Router, private detalleService: DetalleAnalisisService) {}

  // Volver atrás
  cancelar(): void {
    this.router.navigate(['/detalles']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfFile = input.files[0];
    }
  }

  guardar(): void {
    const fechaRegistroIso = this.fechaRegistroLocal
      ? new Date(this.fechaRegistroLocal).toISOString()
      : new Date().toISOString();
    // truncar campos por seguridad a 200 caracteres
    this.resultado = this.resultado ? this.resultado.slice(0,200) : '';
    this.observaciones = this.observaciones ? this.observaciones.slice(0,200) : '';

    const nuevo: Partial<DetalleAnalisisData> = {
      id_control: 'CTD0001',
      id_analisis: 'A000',
      tipoAnalisis: '',
      fechaRealizacion: this.fechaRealizacion ?? new Date().toISOString().slice(0,10),
      fechaRegistro: fechaRegistroIso,
      laboratorio: this.laboratorio,
      resultado: this.resultado,
      observaciones: this.observaciones,
      pdfResultado: this.pdfFile ? `uploads/${this.pdfFile.name}` : ''
    };

    this.detalleService.crearDetalle(nuevo as DetalleAnalisisData).subscribe((created: DetalleAnalisisData) => {
      console.log('Detalle creado (mock):', created);
      this.router.navigate(['/detalles']);
    });
  }
}
