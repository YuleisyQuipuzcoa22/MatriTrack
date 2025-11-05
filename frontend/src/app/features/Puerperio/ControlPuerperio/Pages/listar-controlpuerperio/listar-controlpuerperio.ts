import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Controlpuerperio, ControlPuerperioData } from '../../service/controlpuerperio.service';

@Component({
  selector: 'app-listar-controlpuerperio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-controlpuerperio.html',
  styleUrls: ['./listar-controlpuerperio.css']
})
export class ListarControlpuerperio implements OnInit {
  programaId: string | null = null;
  controles: ControlPuerperioData[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private service: Controlpuerperio) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    if (this.programaId) {
      this.service.listarControlesPorPrograma(this.programaId).subscribe(data => {
        this.controles = data;
      });
    }
  }

  volver(): void {
    this.router.navigate(['/puerperio']);
  }

  crearControl(): void {
    if (this.programaId) this.router.navigate(['/puerperio', this.programaId, 'controles', 'crear']);
  }

  editarControl(cid: string): void {
    if (this.programaId) this.router.navigate(['/puerperio', this.programaId, 'controles', 'editar', cid]);
  }

  verAnalisis(cid: string): void {
    if (this.programaId) this.router.navigate(['/puerperio', this.programaId, 'controles', cid, 'analisis']);
  }

}
