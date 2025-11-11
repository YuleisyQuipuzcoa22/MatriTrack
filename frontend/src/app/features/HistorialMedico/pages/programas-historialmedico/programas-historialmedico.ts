import { Component, OnInit } from '@angular/core';
import { ProgramaDiagnosticoListComponent } from '../../../ProgramaDiagnostico/pages/programa-diagnostico-list.component/list-programadiagnostico';
import { ListarProgramapuerperio } from '../../../Puerperio/ProgramaPuerperio/Pages/listar-programapuerperio/listar-programapuerperio';
import { HistorialMedicoCompleto } from '../../model/historial-medico';
import { HistorialmedicoService } from '../../services/historialmedico.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-programas-historialmedico',
  imports: [CommonModule, RouterLink],
  templateUrl: './programas-historialmedico.html',
  styleUrl: './programas-historialmedico.css'
})
export class ProgramasHistorialmedico implements OnInit {
 historialCompleto: HistorialMedicoCompleto | null = null;
  
  // IDs
  idPaciente: string | null = null;
  idHistorial: string | null = null;

  // Control de interfaz
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private historialMedicoService: HistorialmedicoService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    // obtenemos el ID del paciente de la ruta
    this.route.paramMap.subscribe(params => {
      this.idPaciente = params.get('id_paciente');

      if (this.idPaciente) {
        this.cargarHistorial(this.idPaciente);
      } else {
        this.error = 'ID de Paciente no encontrado en la ruta.';
        this.isLoading = false;
      }
    });
  }

  cargarHistorial(idPaciente: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.historialMedicoService.findByPacienteId(idPaciente).subscribe({
      next: (data) => {
        this.historialCompleto = data;
        this.idHistorial = data.id_historialmedico;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el historial. Revise si el paciente tiene historial asociado.';
        this.isLoading = false;
        console.error('Error cargando historial:', err);
      }
    });
  }

  getDiagnosticoStatus(estado: 'A' | 'F'): string {
    return estado === 'A' ? 'ACTIVO' : 'FINALIZADO';
  }

  getPuerperioStatus(estado: 'A' | 'F'): string {
    return estado === 'A' ? 'ACTIVO' : 'FINALIZADO';
  }
}
