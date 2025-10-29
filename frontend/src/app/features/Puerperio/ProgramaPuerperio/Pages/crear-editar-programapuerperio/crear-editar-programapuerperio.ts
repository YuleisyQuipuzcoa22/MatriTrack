import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programapuerperio, ProgramapuerperioData } from '../../service/programapuerperio.service';

@Component({
  selector: 'app-crear-editar-programapuerperio',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './crear-editar-programapuerperio.html',
  styleUrls: ['./crear-editar-programapuerperio.css']
})
export class CrearEditarProgramapuerperio implements OnInit {
  formData: Partial<ProgramapuerperioData> = {};

  constructor(private route: ActivatedRoute, public router: Router, private service: Programapuerperio) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.obtenerPrograma(id).subscribe((p: ProgramapuerperioData | null) => {
        if (p) {
          this.formData = { ...p };
        }
      });
    }
  }

  guardar(): void {
    if (!this.formData) return;

    const id = this.formData.id_programapuerperio;

    if (id) {
      // actualizar
      this.service.actualizarPrograma(id, this.formData as Partial<ProgramapuerperioData>).subscribe((res) => {
        console.log('Programa actualizado (mock):', res);
        this.router.navigate(['puerperio']);
      });
    } else {
      // crear
      // asegurar campos mínimos
      const nuevo: ProgramapuerperioData = {
        id_programapuerperio: '',
        HistorialMedico_id_historialmedico: this.formData.HistorialMedico_id_historialmedico || '',
        fecha_inicio: this.formData.fecha_inicio || new Date().toISOString().slice(0, 10),
        tipo_parto: (this.formData.tipo_parto as any) || 'NATURAL',
        observacion: this.formData.observacion || '',
        complicacion: this.formData.complicacion || '',
        estado: this.formData.estado || 'A',
        fecha_finalizacion: this.formData.fecha_finalizacion || null,
        motivo_finalizacion: this.formData.motivo_finalizacion || null,
      };
      this.service.crearPrograma(nuevo).subscribe((res) => {
        console.log('Programa creado:', res);
        this.router.navigate(['puerperio']);
      });
    }
  }

}
