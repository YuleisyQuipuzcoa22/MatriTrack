import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-analisis-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analisis-control.html',
  styleUrls: ['./analisis-control.css']
})
export class AnalisisControl implements OnInit {
  programaId: string | null = null;
  controlId: string | null = null;
  // mock simple list of analysis
  analisis: Array<{ id:string, nombre:string, resultado?:string }> = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    this.controlId = this.route.snapshot.paramMap.get('cid');
    // mock
    this.analisis = [
      { id: 'A001', nombre: 'Hemoglobina', resultado: '12.5 g/dL' },
      { id: 'A002', nombre: 'Glucosa', resultado: '95 mg/dL' }
    ];
  }

  volver(): void { this.router.navigate(['/puerperio', this.programaId, 'controles']); }

  agregarAnalisis(): void {
    // navegar a una vista de crear análisis (no implementada aún)
    alert('Abrir formulario de análisis (mock)');
  }
}
