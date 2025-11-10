import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ControldiagnosticoService } from '../../service/controldiagnostico.service';
import { ControlDiagnostico } from '../../model/controldiagnostico.model';
@Component({
  selector: 'app-listar-controles',
  imports: [CommonModule],
  templateUrl: './listar-controles.html',
  styleUrl: './listar-controles.css'
})
export class ListarControles implements OnInit {
  programaId: string | null = null;
  controles: ControlDiagnostico[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: ControldiagnosticoService
  ) {}


  ngOnInit(): void {
      this.programaId = this.route.snapshot.paramMap.get('id');
      if(this.programaId) this.cargarControles(this.programaId);
    
  }


  cargarControles(programaId: string): void {
    this.isLoading = true;
    this.service.listarControlesPorPrograma(programaId).subscribe({
      next: (data) => {
        this.controles = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los controles:', error);
        this.isLoading = false;
      }
    });
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
    if(this.programaId)this.router.navigate(['/diagnostico', this.programaId, 'controles', 'crear']);
  }

  editarControl(cid: string): void {
    if(this.programaId) this.router.navigate(['/diagnostico', this.programaId, 'controles', 'editar', cid]);
  }


}
