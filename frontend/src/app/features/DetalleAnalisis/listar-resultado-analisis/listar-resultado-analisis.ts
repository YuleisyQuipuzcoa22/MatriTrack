import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadoAnalisisService, ResultadoAnalisisData } from '../services/resultado-analisis';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProgramaDiagnosticoService } from '../../ProgramaDiagnostico/services/programadiagnostico.service';
import { ProgramapuerperioService } from '../../Puerperio/ProgramaPuerperio/service/programapuerperio.service';

@Component({
  selector: 'app-listar-resultado-analisis',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './listar-resultado-analisis.html',
  styleUrls: ['./listar-resultado-analisis.css']
})
export class ListarResultadoAnalisis implements OnInit {

  resultados: ResultadoAnalisisData[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  programaId: string | null = null; 
  idControl: string | null = null;  
  tipoControl: 'diagnostico' | 'puerperio' | null = null;
  rutaVolver: string = '/';
  pacienteNombre: string = 'Cargando...'; 
  
  tiposAnalisis: string[] = [];

  constructor(
    private resultadoService: ResultadoAnalisisService,
    private route: ActivatedRoute, 
    private router: Router,
    private progDiagnosticoService: ProgramaDiagnosticoService,
    private progPuerperioService: ProgramapuerperioService
  ) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      
      //obtiene los parámetros
      this.programaId = params.get('id');
      this.idControl = params.get('idControl');

      const urlSegments = this.route.snapshot.url;
      if (urlSegments.some(segment => segment.path === 'diagnostico')) {
        this.tipoControl = 'diagnostico';
      } else if (urlSegments.some(segment => segment.path === 'puerperio')) {
        this.tipoControl = 'puerperio';
      } else {
        this.tipoControl = null;
      }

      //logica de carga
      if (this.idControl && this.tipoControl) {
        this.cargarResultados(this.idControl, this.tipoControl);
      } else {
        this.isLoading = false;
        this.errorMessage = "No se pudo determinar el control.";
      }

      // carga de contexto 
      if (this.programaId && this.tipoControl) {
        this.cargarDatosContexto(this.programaId, this.tipoControl);
      } else {
        this.pacienteNombre = 'Paciente no encontrado'; 
        if (!this.programaId) {
            console.error("Error: El parámetro ':id' (programaId) es nulo en la URL.");
        }
      }
    });
  }

  cargarDatosContexto(programaId: string, tipo: 'diagnostico' | 'puerperio'): void {
    if (tipo === 'diagnostico') {
      this.progDiagnosticoService.getProgramaById(programaId).subscribe({
        next: (programa) => {
          if (programa.paciente) {
            this.pacienteNombre = `${programa.paciente.nombre} ${programa.paciente.apellido}`;
          }
        },
        error: () => { this.pacienteNombre = 'Error al cargar paciente'; }
      });
    } else {
      this.progPuerperioService.getProgramaById(programaId).subscribe({
        next: (programa) => {
          if (programa.paciente) {
            this.pacienteNombre = `${programa.paciente.nombre} ${programa.paciente.apellido}`;
          }
        },
        error: () => { this.pacienteNombre = 'Error al cargar paciente'; }
      });
    }

    // Definir la ruta de 'volver'
    this.rutaVolver = `/${tipo}/${programaId}/controles`;
  }

  cargarResultados(idControl: string, tipo: 'diagnostico' | 'puerperio'): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.resultadoService.listarResultadosPorControl(idControl, tipo).subscribe({
      next: (data) => {
        this.resultados = data;
        this.tiposAnalisis = Array.from(new Set(data.map(d => d.analisis?.nombre_analisis || 'N/A')));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar resultados:', err);
        this.errorMessage = "No se pudieron cargar los resultados del control.";
        this.isLoading = false;
      }
    });
  }

 irARegistrar(): void {
    this.router.navigate(['/resultado-analisis/registrar'], { 
      queryParams: { 
        idControl: this.idControl, 
        tipoControl: this.tipoControl,
        programaId: this.programaId 
      } 
    });
  }
  
  verDetalle(idResultado: string): void {
    this.router.navigate(['/consulta-resultados-analisis', idResultado]);
  }

  editarResultado(idResultado: string): void {
    this.router.navigate(['/resultado-analisis', idResultado]);
  }

  eliminarResultado(idResultado: string): void {
    if (confirm('¿Está seguro de que desea eliminar este resultado? Esta acción no se puede deshacer.')) {
      this.resultadoService.eliminarResultado(idResultado).subscribe({
        next: () => {
          this.resultados = this.resultados.filter(r => r.id_resultado_analisis !== idResultado);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessage = 'Error al eliminar el resultado. Inténtelo de nuevo.';
        }
      });
    }
  }
}