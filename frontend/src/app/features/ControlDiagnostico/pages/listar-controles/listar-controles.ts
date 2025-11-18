import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ControldiagnosticoService, ControlDiagnosticoFilters } from '../../service/controldiagnostico.service';
import { ControlDiagnostico } from '../../model/controldiagnostico.model';
import { Paginacion } from '../../../../components/paginacion/paginacion';
import { FormsModule } from '@angular/forms';
import { ProgramaDiagnosticoService } from '../../../ProgramaDiagnostico/services/programadiagnostico.service';
@Component({
  selector: 'app-listar-controles',
  imports: [CommonModule, Paginacion, FormsModule],
  templateUrl: './listar-controles.html',
  styleUrl: './listar-controles.css'
})
export class ListarControles implements OnInit {
  programaId: string | null = null;
  controles: ControlDiagnostico[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  filtroFechaInicio = '';
  filtroFechaFin = '';
  hayFiltroActivo = false;
  nombrePaciente: string=''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: ControldiagnosticoService,
    private programaService: ProgramaDiagnosticoService 

  ) {}


  ngOnInit(): void {
      this.programaId = this.route.snapshot.paramMap.get('id');
      
      if(this.programaId) {
        this.cargarDatosPrograma(this.programaId); 
        this.cargarControles();

      }
    
  }

  
cargarDatosPrograma(id_programa:string):void{
  this.programaService.getProgramaById(id_programa).subscribe({
    next:(programa)=>{
      if(programa.paciente){
        this.nombrePaciente =`${programa.paciente.nombre} ${programa.paciente.apellido}`;
      }
    },
    error:(err)=>{
      console.error('ERROR OBTENIENDO PACIENTE', err)
    }
  })
}

 cargarControles(): void {
    if (!this.programaId) return;
    this.isLoading = true;
    this.actualizarBotonLimpiar();

    const filters: ControlDiagnosticoFilters = {
      page: this.currentPage,
      limit: this.pageSize,
      fechaInicio: this.filtroFechaInicio || undefined,
      fechaFin: this.filtroFechaFin || undefined,
      order: 'DESC',
    };

      console.log('Filtros enviados al backend:', filters); 


    this.service.listarControlesPorPrograma(this.programaId, filters).subscribe({
  next: (res) => {
        console.debug('Respuesta paginada:', res);
    this.controles   = res.data;
    this.totalItems  = res.meta.total;
    this.totalPages  = res.meta.totalPages;
    this.currentPage = res.meta.page;
    this.isLoading   = false;
  },
  error: (err) => {
          console.error('Error al cargar los controles:', err);

    this.isLoading = false;
  },
});
  }

  filtrarPorFecha(): void {
    if (this.filtroFechaInicio && this.filtroFechaFin && this.filtroFechaInicio > this.filtroFechaFin) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }
    this.currentPage = 1;
    this.cargarControles();
  }

  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo = !!this.filtroFechaInicio || !!this.filtroFechaFin;
  }

  limpiarFiltros(): void {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.currentPage = 1;
    this.cargarControles();
  }

  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarControles();
  }

  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.cargarControles();
  }

  volver(): void {
    this.router.navigate(['/diagnostico']);
  }

  verAnalisis(controlId: string): void {
    if (this.programaId) {
      this.router.navigate(['/diagnostico', this.programaId, 'control', controlId, 'resultados']);
    }
  }


  crearControl(): void {
    if (this.programaId)
      this.router.navigate(['/diagnostico', this.programaId, 'controles', 'crear']);
  }

  editarControl(cid: string): void {
    if (this.programaId)
      this.router.navigate(['/diagnostico', this.programaId, 'controles', 'editar', cid]);
  }

}