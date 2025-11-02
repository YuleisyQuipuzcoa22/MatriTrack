// src/app/features/Puerperio/ControlPuerperio/Pages/crear-editar-controlpuerperio/crear-editar-control-puerperio.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // <-- Quitado RouterLink
import { ControlpuerperioService } from '../../service/controlpuerperio.service';
import {
  ControlPuerperio,
  CreateControlPuerperioDto,
  UpdateControlPuerperioDto,
} from '../../model/controlpuerperio.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crear-editar-controlpuerperio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- Quitado RouterLink
  templateUrl: './crear-editar-controlpuerperio.html',
  styleUrls: ['./crear-editar-controlpuerperio.css'],
})
export class CrearEditarControlpuerperio implements OnInit {
  programaId: string | null = null;
  controlId: string | null = null;
  controlForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage: string | null = null;

  // Fecha de control (para modo edición)
  fechaCreacion: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: ControlpuerperioService
  ) {}

  ngOnInit(): void {
    // 1. Obtener IDs de la ruta
    this.programaId = this.route.snapshot.paramMap.get('id');
    this.controlId = this.route.snapshot.paramMap.get('cid');
    this.isEditMode = !!this.controlId;

    if (!this.programaId) {
      this.errorMessage = 'Error: No se proporcionó ID del programa.';
      // Idealmente, redirigir
      this.router.navigate(['/puerperio']);
      return;
    }

    // 2. Inicializar formulario
    this.initializeForm();

    // 3. Cargar datos si estamos en modo edición
    if (this.isEditMode && this.controlId) {
      this.loadControlData(this.programaId, this.controlId);
    }
  }

  private initializeForm(): void {
    // Basado en CreateControlPuerperioDto
    this.controlForm = this.fb.group({
      // Campos requeridos
      peso: [
        null,
        [
          Validators.required,
          Validators.min(30),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      talla: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(2.5),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      presion_arterial: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{2,3}\/\d{2,3}$/),
        ],
      ],
      // Campos opcionales
      involucion_uterina: ['', [Validators.maxLength(100)]],
      cicatrizacion: ['', [Validators.maxLength(100)]],
      estado_mamas_lactancia: ['', [Validators.maxLength(100)]],
      estado_emocional: ['', [Validators.maxLength(100)]],
      observacion: ['', [Validators.maxLength(500)]],
      recomendacion: ['', [Validators.maxLength(500)]],
    });
  }

  private loadControlData(programaId: string, controlId: string): void {
    this.isLoading = true;
    this.service.obtenerControl(programaId, controlId).subscribe({
      next: (control) => {
        this.controlForm.patchValue({
          peso: control.peso,
          talla: control.talla,
          presion_arterial: control.presion_arterial,
          involucion_uterina: control.involucion_uterina || '',
          cicatrizacion: control.cicatrizacion || '',
          estado_mamas_lactancia: control.estado_mamas_lactancia || '',
          estado_emocional: control.estado_emocional || '',
          observacion: control.observacion || '',
          recomendacion: control.recomendacion || '',
        });
        this.fechaCreacion = control.fecha_controlpuerperio;
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
    this.errorMessage = null;
    if (this.controlForm.invalid) {
      this.controlForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrija los errores en el formulario.';
      return;
    }

    if (!this.programaId) {
      this.errorMessage = 'Error fatal: Falta el ID del programa.';
      return;
    }

    this.isLoading = true;
    const formValues = this.controlForm.value;

    const dto: CreateControlPuerperioDto | UpdateControlPuerperioDto = {
      peso: parseFloat(formValues.peso),
      talla: parseFloat(formValues.talla),
      presion_arterial: formValues.presion_arterial,
      involucion_uterina: formValues.involucion_uterina || undefined,
      cicatrizacion: formValues.cicatrizacion || undefined,
      estado_mamas_lactancia: formValues.estado_mamas_lactancia || undefined,
      estado_emocional: formValues.estado_emocional || undefined,
      observacion: formValues.observacion || undefined,
      recomendacion: formValues.recomendacion || undefined,
    };

    let request$: Observable<ControlPuerperio>;

    if (this.isEditMode && this.controlId) {
      // Actualizar
      request$ = this.service.actualizarControl(
        this.programaId,
        this.controlId,
        dto
      );
    } else {
      // Crear
      request$ = this.service.crearControl(
        this.programaId,
        dto as CreateControlPuerperioDto
      );
    }

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        alert(this.isEditMode ? 'Control actualizado' : 'Control creado');
        this.router.navigate(['/puerperio', this.programaId, 'controles']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.errorMessage =
          err.error?.message || 'Error al guardar el control.';
        this.isLoading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/puerperio', this.programaId, 'controles']);
  }

  // Helper para validación en HTML
  isInvalid(controlName: string): boolean {
    const control = this.controlForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getErrorMessage(controlName: string): string {
    const control = this.controlForm.get(controlName);
    if (control?.errors?.['required']) return 'Este campo es obligatorio.';
    if (control?.errors?.['min']) return `El valor debe ser al menos ${control.errors['min'].min}.`;
    if (control?.errors?.['max']) return `El valor debe ser máximo ${control.errors['max'].max}.`;
    if (control?.errors?.['pattern']) return 'Formato incorrecto (Ej. 120/80 o 1.70).';
    if (control?.errors?.['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
    return '';
  }
}