// src/app/features/Puerperio/ProgramaPuerperio/Pages/crear-editar-programapuerperio/crear-editar-programapuerperio.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ProgramapuerperioService,
} from '../../service/programapuerperio.service';
import {
  ProgramaPuerperio,
  TipoParto,
  PacienteParaPuerperio,
  CreateProgramaPuerperioDto,
  UpdateProgramaPuerperioDto,
} from '../../model/programapuerperio.model';
import { Observable, Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-crear-editar-programapuerperio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-editar-programapuerperio.html',
  styleUrls: [
    './crear-editar-programapuerperio.css',
    '../../../../ProgramaDiagnostico/pages/crear-editar-prog-diagnostico/crear-editar-prog-diagnostico.css',
  ],
})
export class CrearEditarProgramapuerperio implements OnInit {
  programaForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  // Modo de operación
  isEditMode = false;
  programaId: string | null = null;

  // Búsqueda de pacientes
  isSearchingPatient = false;
  private pacienteBusqueda$ = new Subject<string>(); 
  pacientesDisponibles: PacienteParaPuerperio[] = [];
  pacienteSeleccionado: PacienteParaPuerperio | null = null;
  historialIdVinculado: string | null = null;

  // Enums para el template
  TipoParto = TipoParto;
  tiposDeParto = Object.values(TipoParto);

  constructor(
    private fb: FormBuilder,
    private programaService: ProgramapuerperioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.determineMode();
    this.setupPacienteSearch(); // <--- IMPORTANTE: El listener se activa aquí
  }

  private initializeForm(): void {
    this.programaForm = this.fb.group({
      dniBusqueda: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      tipo_parto: [ { value: '', disabled: true }, [Validators.required] ],
      complicacion: [ { value: '', disabled: true }, [Validators.maxLength(500)] ],
      observacion: [ { value: '', disabled: true }, [Validators.maxLength(1000)] ],
    });
  }

  private determineMode(): void {
    this.programaId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.programaId;

    if (this.isEditMode) {
      this.loadProgramaForEdit();
    }
  }

  private loadProgramaForEdit(): void {
    if (!this.programaId) return;

    this.isLoading = true;
    this.programaService.getProgramaById(this.programaId).subscribe({
      next: (programa: ProgramaPuerperio) => {
        this.programaForm.get('dniBusqueda')?.disable();
        
        if(programa.paciente) {
            this.pacienteSeleccionado = {
                id_historialmedico: programa.id_historialmedico,
                id_paciente: programa.paciente.id_paciente,
                nombre_completo: `${programa.paciente.nombre} ${programa.paciente.apellido}`,
                dni: programa.paciente.dni,
                edad: programa.paciente.edad,
                fecha_parto: ''
            };
            this.historialIdVinculado = programa.id_historialmedico;
        }

        this.programaForm.patchValue({
          tipo_parto: programa.tipo_parto,
          complicacion: programa.complicacion || '',
          observacion: programa.observacion || '',
        });

        this.enableProgramaFields();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar programa:', err);
        this.errorMessage = 'No se pudo cargar el programa para edición.';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/puerperio']), 2000);
      },
    });
  }

  // --- Lógica de Búsqueda de Pacientes (Modo Creación) ---

  // CORREGIDO: setupPacienteSearch ahora escucha el Subject
  // y realiza la lógica de búsqueda y filtrado.
  private setupPacienteSearch(): void {
    this.pacienteBusqueda$
      .pipe(
        distinctUntilChanged(),
        tap(() => {
          this.isSearchingPatient = true;
          this.pacientesDisponibles = []; // Limpia la lista antigua
          this.clearMessages();
        }),
        // Llama al servicio con el término (DNI)
        switchMap((term) => this.programaService.getPacientesDisponibles(term))
      )
      .subscribe({
        next: (pacientes) => {
          this.isSearchingPatient = false;
          
          // Obtenemos el DNI exacto que se buscó
          const dniBuscado = this.programaForm.get('dniBusqueda')?.value;
          // Filtramos la respuesta para encontrar la coincidencia EXACTA del DNI
          const pacienteEncontrado = pacientes.find(p => p.dni === dniBuscado);

          if (pacienteEncontrado) {
            // ¡Éxito!
            this.seleccionarPaciente(pacienteEncontrado);
          } else {
            // Fracaso
            this.errorMessage = `No se encontró un paciente disponible (post-parto) con el DNI ${dniBuscado}. Verifique el DNI o si el programa de diagnóstico fue finalizado por "PARTO".`;
          }
        },
        error: (err) => {
          console.error('Error al buscar pacientes:', err);
          this.errorMessage = 'Error al buscar pacientes. ' + (err.error?.message || '');
          this.isSearchingPatient = false;
        },
      });
  }
  
  // CORREGIDO: triggerSearch ahora solo valida y
  // "dispara" el Subject (pacienteBusqueda$)
  triggerSearch(): void {
    this.clearMessages();
    this.resetPacienteVinculado();

    const dniControl = this.programaForm.get('dniBusqueda');

    // 1. Validar que el DNI sea de 8 dígitos
    if (!dniControl || dniControl.invalid) {
      dniControl?.markAsTouched();
      this.errorMessage = 'Ingrese un DNI válido de 8 dígitos.';
      return;
    }

    // 2. Enviar el DNI válido al stream (Subject) para que setupPacienteSearch lo procese
    this.pacienteBusqueda$.next(dniControl.value.trim());
  }


  seleccionarPaciente(paciente: PacienteParaPuerperio): void {
    this.pacienteSeleccionado = paciente;
    this.historialIdVinculado = paciente.id_historialmedico;
    // this.pacientesDisponibles = []; // Ya no es necesario
    this.programaForm.get('dniBusqueda')?.setValue(paciente.dni, { emitEvent: false });
    this.programaForm.get('dniBusqueda')?.disable();
    this.enableProgramaFields();
    this.successMessage = `Paciente ${paciente.nombre_completo} vinculado.`;
  }

  private resetPacienteVinculado(): void {
    this.pacienteSeleccionado = null;
    this.historialIdVinculado = null;
    this.disableProgramaFields();
  }

  cambiarPaciente(): void {
    this.resetPacienteVinculado();
    this.clearMessages();
    this.programaForm.get('dniBusqueda')?.reset('');
    this.programaForm.get('dniBusqueda')?.enable();
  }

  // --- Habilitar/Deshabilitar Campos ---

  private enableProgramaFields(): void {
    this.programaForm.get('tipo_parto')?.enable();
    this.programaForm.get('complicacion')?.enable();
    this.programaForm.get('observacion')?.enable();
  }

  private disableProgramaFields(): void {
    this.programaForm.get('tipo_parto')?.disable();
    this.programaForm.get('complicacion')?.disable();
    this.programaForm.get('observacion')?.disable();
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  // --- Envío de Formulario ---

  onSubmit(): void {
    this.clearMessages();

    if (this.programaForm.invalid) {
      this.errorMessage = 'Complete todos los campos requeridos correctamente.';
      this.programaForm.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && !this.historialIdVinculado) {
      this.errorMessage =
        'Debe buscar y seleccionar un paciente válido antes de registrar el programa.';
      return;
    }

    this.isLoading = true;

    const formValues = this.programaForm.getRawValue();

    const dto: CreateProgramaPuerperioDto | UpdateProgramaPuerperioDto = {
      tipo_parto: formValues.tipo_parto,
      complicacion: formValues.complicacion?.trim() || undefined,
      observacion: formValues.observacion?.trim() || undefined,
    };

    const request$: Observable<ProgramaPuerperio> =
      this.isEditMode && this.programaId
        ? this.programaService.updatePrograma(this.programaId, dto)
        : this.programaService.createPrograma(
            this.historialIdVinculado!,
            dto as CreateProgramaPuerperioDto
          );

    const successMsg = this.isEditMode
      ? 'Programa actualizado exitosamente.'
      : `Programa registrado exitosamente para ${this.pacienteSeleccionado?.nombre_completo}.`;

    request$.subscribe({
      next: () => {
        this.successMessage = successMsg;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/puerperio']), 1500);
      },
      error: (err) => {
        console.error('Error en la operación:', err);
        this.errorMessage =
          err.error?.message ||
          'Error al procesar la solicitud. Intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  get canSubmit(): boolean {
    return (
      this.programaForm.valid &&
      (this.isEditMode || !!this.historialIdVinculado)
    );
  }
}