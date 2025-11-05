import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DetalleAnalisisService, DetalleAnalisisData } from '../services/detalle-analisis.service';

@Component({
  selector: 'app-consulta-ver-detalles',
  imports: [RouterLink],
  templateUrl: './consulta-ver-detalles.html',
  styleUrls: ['./consulta-ver-detalles.css']
})
export class ConsultaVerDetalles implements OnInit {
  detalleAnalisis: DetalleAnalisisData | null = null;
  idDetalle: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detalleService: DetalleAnalisisService
  ) {}

  ngOnInit(): void {
    // Obtener el ID desde la ruta
    this.route.params.subscribe(params => {
      this.idDetalle = params['id'];
      if (this.idDetalle) {
        this.cargarDetalle();
      } else {
        // Si no hay ID, redirigir al listado
        this.router.navigate(['/detalle-analisis']);
      }
    });
  }

  cargarDetalle(): void {
    this.detalleService.getDetalleById(this.idDetalle).subscribe({
      next: (detalle) => {
        if (detalle) {
          this.detalleAnalisis = detalle;
        } else {
          // Si no se encuentra el detalle, mostrar mensaje o redirigir
          console.error('Detalle no encontrado');
          alert('No se encontró el detalle de análisis solicitado.');
          this.router.navigate(['/detalle-analisis']);
        }
      },
      error: (error) => {
        console.error('Error al cargar el detalle:', error);
        alert('Error al cargar la información del análisis.');
        this.router.navigate(['/detalle-analisis']);
      }
    });
  }

  descargarPDF(): void {
    if (this.detalleAnalisis?.pdfResultado) {
      // Descargar directamente 
      
      const link = document.createElement('a');
      link.href = this.detalleAnalisis.pdfResultado;
      link.download = `Analisis_${this.detalleAnalisis.id}.pdf`;
      link.click();
      
    } else {
      alert('No hay PDF disponible para este análisis.');
    }
  }

  volver(): void {
    this.router.navigate(['/detalle-analisis']);
  }
}