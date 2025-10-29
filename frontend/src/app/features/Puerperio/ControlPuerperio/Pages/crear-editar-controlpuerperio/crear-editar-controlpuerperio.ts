import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Controlpuerperio, ControlPuerperioData } from '../../service/controlpuerperio.service';

@Component({
  selector: 'app-crear-editar-controlpuerperio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-editar-controlpuerperio.html',
  styleUrls: ['./crear-editar-controlpuerperio.css']
})
export class CrearEditarControlpuerperio implements OnInit {
  programaId: string | null = null;
  controlId: string | null = null;
  formData: Partial<ControlPuerperioData> = {};

  constructor(private route: ActivatedRoute, private router: Router, private service: Controlpuerperio) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    this.controlId = this.route.snapshot.paramMap.get('cid');

    if (this.controlId) {
      this.service.obtenerControl(this.controlId).subscribe(c => {
        if (c) this.formData = { ...c };
      });
    } else {
      // preset program id
      if (this.programaId) this.formData.Programa_Puerperio_id_programapuerperio = this.programaId;
      this.formData.fecha_controlpuerperio = new Date().toISOString().slice(0,10);
    }
  }

  guardar(): void {
    if (this.controlId) {
      this.service.actualizarControl(this.controlId, this.formData).subscribe(() => {
        this.router.navigate(['/puerperio', this.programaId, 'controles']);
      });
    } else {
      const nuevo = this.formData as ControlPuerperioData;
      // asegurar campo programa
      if (this.programaId) nuevo.Programa_Puerperio_id_programapuerperio = this.programaId;
      this.service.crearControl(nuevo).subscribe(() => {
        this.router.navigate(['/puerperio', this.programaId, 'controles']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/puerperio', this.programaId, 'controles']);
  }
}
