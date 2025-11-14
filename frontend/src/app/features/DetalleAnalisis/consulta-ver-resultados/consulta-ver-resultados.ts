import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultadoAnalisisService, ResultadoAnalisisData } from '../services/resultado-analisis';

import { CommonModule, DatePipe, Location } from '@angular/common'; 

@Component({
  selector: 'app-consulta-ver-resultados',
  standalone: true,
  imports: [ CommonModule, DatePipe], 
  providers: [DatePipe],
  templateUrl: './consulta-ver-resultados.html',
  styleUrls: ['./consulta-ver-resultados.css']
})
export class ConsultaVerResultados implements OnInit {
  resultadoAnalisis: ResultadoAnalisisData | null = null;
  idResultado: string = '';
  isLoading = true;
  errorMessage: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultadoService: ResultadoAnalisisService,
    private location: Location 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idResultado = params['id'];
      if (this.idResultado) {
        this.cargarResultado();
      } else {
        this.isLoading = false;
        this.errorMessage = "ID de resultado no encontrado.";
      }
    });
  }

  cargarResultado(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.resultadoService.getResultadoById(this.idResultado).subscribe({
      next: (resultado) => {
        this.resultadoAnalisis = resultado;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el resultado:', error);
        this.errorMessage = 'Error al cargar la información del análisis.';
        this.isLoading = false;
      }
    });
  }

  descargarPDF(): void {
    if (this.resultadoAnalisis && this.resultadoAnalisis.ruta_pdf) {
      const pdfUrl = `http://localhost:3000/uploads/${this.resultadoAnalisis.ruta_pdf}`;
      window.open(pdfUrl, '_blank');
    } else {
      alert('No hay PDF disponible para este análisis.');
    }
  }

  volver(): void {
    this.location.back(); 
  }

  editar(): void {
    this.router.navigate(['/resultado-analisis', this.idResultado]);
  }
}