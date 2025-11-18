import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControldiagnosticoService } from '../../service/controldiagnostico.service';
import { ProgramaDiagnosticoService } from '../../../ProgramaDiagnostico/services/programadiagnostico.service';
import {
  ControlDiagnostico,
  CreateControlDiagnosticoDto,
  UpdateControlDiagnosticoDto,
} from '../../model/controldiagnostico.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crear-editar-controldiagnostico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './crear-editar-control.html',
  styleUrls: ['./crear-editar-control.css'],
})
export class CrearEditarControlDiagnostico implements OnInit {
  programaId: string | null = null;
  controlId: string | null = null;
  controlForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage: string | null = null;
  pacienteNombre: string | null = null;
  fechaCreacion: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: ControldiagnosticoService,
    private datePipe: DatePipe,
    private programaService: ProgramaDiagnosticoService,

  ) {}

  ngOnInit(): void {

    this.programaId = this.route.snapshot.paramMap.get('id');
    this.controlId = this.route.snapshot.paramMap.get('cid');
    this.isEditMode = !!this.controlId;

    if (!this.programaId) {
      this.router.navigate(['/diagnostico']);
      return;
    }

    this.cargarDatosPrograma(this.programaId);


    this.initializeForm();

    if (this.isEditMode && this.controlId) {
      this.loadControlData(this.programaId, this.controlId);
    }
  }
  private cargarDatosPrograma(id_programa:string){
    this.programaService.getProgramaById(id_programa).subscribe({
    next: (programa) => {
      if (programa.paciente) {
        this.pacienteNombre = `${programa.paciente.nombre} ${programa.paciente.apellido}`;
      }
    },
    error: (err) => {
      console.error("Error cargando datos del programa:", err);
    }
  });
  }

  private initializeForm(): void {
    this.controlForm = this.fb.group({
      semana_gestacion: [null, [Validators.required, Validators.min(1), Validators.max(42)]],
      peso: [null, [Validators.required, Validators.min(30)]],
      talla: [null, [Validators.required, Validators.min(1), Validators.max(2.5)]],
      presion_arterial: ['', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]],
      altura_uterina: [null, [Validators.min(5), Validators.max(45)]],
      fcf: [null, [Validators.min(100), Validators.max(180)]],
      observacion: ['', [Validators.maxLength(255)]],
      recomendacion: ['', [Validators.maxLength(255)]],
    });
  }

  private loadControlData(programaId: string, controlId: string): void {
    this.isLoading = true;
    this.service.obtenerControl(programaId, controlId).subscribe({
      next: (control) => {
        this.controlForm.patchValue(control);

        this.fechaCreacion = this.datePipe.transform(control.fecha_controldiagnostico, 'dd/MM/yyyy HH:mm', '-0500');
        this.isLoading = false;

      },
      error: (err) => {
        console.error('Error al cargar control:', err);
        this.errorMessage = 'No se pudo cargar el control para edición.';
        this.isLoading = false;

        
      },
      
    });
  }

  guardar(): void {
    if (this.controlForm.invalid) {
      this.controlForm.markAllAsTouched();
      return;
    }

    if (!this.programaId) return;

    this.isLoading = true;
    const dto: CreateControlDiagnosticoDto | UpdateControlDiagnosticoDto = this.controlForm.value;
    let request$: Observable<ControlDiagnostico>;

    if (this.isEditMode && this.controlId) {
      request$ = this.service.actualizarControl(this.programaId, this.controlId, dto);
    } else {
      request$ = this.service.crearControl(this.programaId, dto as CreateControlDiagnosticoDto);
    }

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        alert(this.isEditMode ? 'Control actualizado' : 'Control creado');
        this.router.navigate(['/diagnostico', this.programaId, 'controles']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.errorMessage = err.error?.message || 'Error al guardar el control.';
        this.isLoading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/diagnostico', this.programaId, 'controles']);
  }
  isInvalid(controlName: string): boolean {
    const control = this.controlForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.controlForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio.';
    if (control.errors['min'])
      return `El valor debe ser al menos ${control.errors['min'].min}.`;
    if (control.errors['max'])
      return `El valor no puede superar ${control.errors['max'].max}.`;
    if (control.errors['pattern']) return 'Formato incorrecto (Ej. 120/80).';
    if (control.errors['maxlength'])
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;

    return 'Valor inválido.';
  }
}
