import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { forkJoin, map, Observable } from 'rxjs';


import { ProgramaDiagnostico } from '../../../ProgramaDiagnostico/model/programadiagnostico';
import { ProgramaPuerperio } from '../../../Puerperio/ProgramaPuerperio/model/programapuerperio.model';
import { ControlDiagnostico } from '../../../ControlDiagnostico/model/controldiagnostico.model';
import { ControlPuerperio } from '../../../Puerperio/ControlPuerperio/model/controlpuerperio.model';
import { ResultadoAnalisisData } from '../../../DetalleAnalisis/services/resultado-analisis';

import { ProgramaDiagnosticoService } from '../../../ProgramaDiagnostico/services/programadiagnostico.service';
import { ProgramapuerperioService } from '../../../Puerperio/ProgramaPuerperio/service/programapuerperio.service';
import { ControldiagnosticoService } from '../../../ControlDiagnostico/service/controldiagnostico.service';
import { ControlpuerperioService } from '../../../Puerperio/ControlPuerperio/service/controlpuerperio.service';
import { ResultadoAnalisisService } from '../../../DetalleAnalisis/services/resultado-analisis';


type ProgramaUnion = (ProgramaDiagnostico & { tipo: 'diagnostico' }) | (ProgramaPuerperio & { tipo: 'puerperio' });
type ControlUnion = ControlDiagnostico | ControlPuerperio;

@Component({
  selector: 'app-detalle-programa-historialmedico',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], 
  providers: [DatePipe], 
  templateUrl: './detalle-programa-historialmedico.html',
  styleUrls: ['./detalle-programa-historialmedico.css']
})

export class DetalleProgramaHistorialmedico implements OnInit { 

  isLoading = true;
  errorMessage: string | null = null;
  
  programaId: string | null = null;
  programaTipo: 'diagnostico' | 'puerperio' | null = null;

  programa: ProgramaUnion | null = null;
  controles: ControlUnion[] = [];
  analisis: ResultadoAnalisisData[] = [];
  
  // Para el boton de volver
  idPaciente: string | null = null; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progDiagnosticoService: ProgramaDiagnosticoService,
    private progPuerperioService: ProgramapuerperioService,
    private ctrlDiagnosticoService: ControldiagnosticoService,
    private ctrlPuerperioService: ControlpuerperioService,
    private resultadoAnalisisService: ResultadoAnalisisService
  ) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    
    if (this.route.snapshot.url.some(s => s.path === 'diagnostico')) {
      this.programaTipo = 'diagnostico';
    } else if (this.route.snapshot.url.some(s => s.path === 'puerperio')) {
      this.programaTipo = 'puerperio';
    }

    if (this.programaId && this.programaTipo) {
      this.cargarDatos(this.programaId, this.programaTipo);
    } else {
      this.errorMessage = "No se pudo determinar el programa a cargar.";
      this.isLoading = false;
    }
  }

  cargarDatos(id: string, tipo: 'diagnostico' | 'puerperio'): void {
    this.isLoading = true;

    let obsPrograma$: Observable<ProgramaUnion>;
    let obsControles$: Observable<ControlUnion[]>;
    
    if (tipo === 'diagnostico') {
      obsPrograma$ = this.progDiagnosticoService.getProgramaById(id).pipe(map(p => ({ ...p, tipo: 'diagnostico' } as ProgramaUnion)));
      obsControles$ = this.ctrlDiagnosticoService.listarControlesPorPrograma(id).pipe(map(response => response.data));
    } else {
      obsPrograma$ = this.progPuerperioService.getProgramaById(id).pipe(map(p => ({ ...p, tipo: 'puerperio' } as ProgramaUnion)));
      obsControles$ = this.ctrlPuerperioService.listarControlesPorPrograma(id, {}).pipe(map(response => response.data));
    }
    
    const obsAnalisis$ = this.resultadoAnalisisService.listarResultadosPorPrograma(id, tipo);

    forkJoin({
      programa: obsPrograma$,
      controles: obsControles$,
      analisis: obsAnalisis$
    }).subscribe({
      next: (resultados) => {
        this.programa = resultados.programa;
        this.controles = resultados.controles;
        this.analisis = resultados.analisis;
        
        if(this.programa.paciente?.id_paciente){
          this.idPaciente = this.programa.paciente.id_paciente;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar datos del programa:", err);
        this.errorMessage = "Error al cargar los detalles del programa. " + (err.error?.message || '');
        this.isLoading = false;
      }
    });
  }
  
  getControlId(control: ControlUnion): string {
    return (control as ControlDiagnostico).id_control_diagnostico || (control as ControlPuerperio).id_control_puerperio;
  }
  
  getControlFecha(control: ControlUnion): string {
     return (control as ControlDiagnostico).fecha_controldiagnostico || (control as ControlPuerperio).fecha_controlpuerperio;
  }
  /*no usado*/
  editarControl(control: ControlUnion): void {
    if (!this.programa) return;
    const controlId = this.getControlId(control);
    this.router.navigate([`/${this.programa.tipo}`, this.programaId, 'controles', 'editar', controlId]);
  }
  
  verAnalisisControl(control: ControlUnion): void {
    if (!this.programa) return;
    const controlId = this.getControlId(control);
    this.router.navigate([`/${this.programa.tipo}`, this.programaId, 'control', controlId, 'resultados']);
  }

  volverAHistorial(): void {
    if (this.idPaciente) {
      this.router.navigate(['/historialmedico/paciente', this.idPaciente]);
    } else {
       this.router.navigate(['/historialmedico']);
    }
  }
}