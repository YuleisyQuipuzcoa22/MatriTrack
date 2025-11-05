import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteService } from '../../../Paciente/services/paciente.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProgramaDiagnosticoService } from '../../services/programadiagnostico.service';
import { PacienteData } from '../../../Paciente/model/paciente-historial';
import { ProgramaDiagnostico } from '../../model/programadiagnostico';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-editar-prog-diagnostico',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear-editar-prog-diagnostico.html',
  styleUrl: './crear-editar-prog-diagnostico.css',
})
export class CrearEditarProgDiagnostico implements OnInit {
  programaForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  isSearchingPatient = false;

  // Modo de operación
  isEditMode = false;
  programaId: string | null = null;

  // Datos del paciente vinculado (modo creación)
  pacienteVinculado: PacienteData | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private programaService: ProgramaDiagnosticoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.determineMode();
  }

  private initializeForm(): void {
    this.programaForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      numero_gestacion: [{ value: '', disabled: true }, [Validators.required, Validators.min(1), Validators.max(20)]],
      fecha_probableparto: [{ value: '', disabled: true }],
      factor_riesgo: [{ value: '', disabled: true }, [Validators.maxLength(255)]],
      observacion: [{ value: '', disabled: true }, [Validators.maxLength(1000)]],
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
      next: (programa: ProgramaDiagnostico) => {
        // En modo edición, ocultamos la búsqueda de paciente
        this.programaForm.get('dni')?.disable();
        
        // Formatear fecha para input type="date"
        const fechaPartoFormateada = programa.fecha_probableparto 
          ? programa.fecha_probableparto.split('T')[0] 
          : '';

        this.programaForm.patchValue({
          numero_gestacion: programa.numero_gestacion,
          fecha_probableparto: fechaPartoFormateada,
          factor_riesgo: programa.factor_riesgo || '',
          observacion: programa.observacion || '',
        });

        // Habilitar campos para edición
        this.enableProgramaFields();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar programa:', err);
        this.errorMessage = 'No se pudo cargar el programa para edición.';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/diagnostico']), 2000);
      },
    });
  }

  buscarPacientePorDni(): void {
    this.clearMessages();
    this.resetPacienteVinculado();

    const dniControl = this.programaForm.get('dni');
    if (!dniControl || dniControl.invalid) {
      dniControl?.markAsTouched();
      this.errorMessage = 'Ingrese un DNI válido de 8 dígitos.';
      return;
    }

    const dni = dniControl.value.trim();
    this.isSearchingPatient = true;

    this.pacienteService.buscarPacientePorDni(dni).subscribe({
      next: (paciente) => {
        this.isSearchingPatient = false;
        this.processPacienteResult(paciente, dni);
      },
      error: (err) => {
        this.isSearchingPatient = false;
        console.error('Error al buscar paciente:', err);
        this.errorMessage = err.error?.message || 'No se encontró un paciente con ese DNI.';
      },
    });
  }

  private processPacienteResult(paciente: PacienteData | null, dni: string): void {
    if (!paciente) {
      this.errorMessage = `No se encontró un paciente con el DNI ${dni}.`;
      return;
    }

    if (paciente.estado !== 'A') {
      this.errorMessage = `El paciente ${paciente.nombre} ${paciente.apellido} está INACTIVO. No se puede crear un programa.`;
      return;
    }

    if (!paciente.historial_medico?.id_historialmedico) {
      this.errorMessage = 'El paciente no tiene un historial médico asociado.';
      return;
    }

    // Verificar si ya tiene un programa activo
    this.verificarProgramaActivo(paciente);
  }

  private verificarProgramaActivo(paciente: PacienteData): void {
    const historialId = paciente.historial_medico.id_historialmedico;
    
    // Buscar programas del paciente
    this.programaService.listarProgramas({
      dni: paciente.dni,
      estadoPrograma: 'ACTIVO',
      limit: 1,
    }).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.errorMessage = `El paciente ${paciente.nombre} ${paciente.apellido} ya tiene un programa activo. No puede tener dos programas simultáneamente.`;
        } else {
          // No tiene programa activo, puede continuar
          this.vincularPaciente(paciente);
        }
      },
      error: (err) => {
        console.error('Error al verificar programas:', err);
        // Si falla la verificación, permitimos continuar
        this.vincularPaciente(paciente);
      },
    });
  }

  private vincularPaciente(paciente: PacienteData): void {
    this.pacienteVinculado = paciente;
    this.enableProgramaFields();
    this.successMessage = `Paciente ${paciente.nombre} ${paciente.apellido} vinculado correctamente.`;
  }

  cambiarPaciente(): void {
    this.resetPacienteVinculado();
    this.clearMessages();
    this.programaForm.get('dni')?.reset();
    this.programaForm.get('dni')?.enable();
  }

  private resetPacienteVinculado(): void {
    this.pacienteVinculado = null;
    this.disableProgramaFields();
  }

  private enableProgramaFields(): void {
    this.programaForm.get('numero_gestacion')?.enable();
    this.programaForm.get('fecha_probableparto')?.enable();
    this.programaForm.get('factor_riesgo')?.enable();
    this.programaForm.get('observacion')?.enable();
  }

  private disableProgramaFields(): void {
    this.programaForm.get('numero_gestacion')?.disable();
    this.programaForm.get('fecha_probableparto')?.disable();
    this.programaForm.get('factor_riesgo')?.disable();
    this.programaForm.get('observacion')?.disable();
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  onSubmit(): void {
    this.clearMessages();

    if (this.programaForm.invalid) {
      this.errorMessage = 'Complete todos los campos requeridos correctamente.';
      this.programaForm.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && !this.pacienteVinculado?.historial_medico?.id_historialmedico) {
      this.errorMessage = 'Debe vincular un paciente válido antes de registrar el programa.';
      return;
    }

    this.isLoading = true;

    const formValues = this.programaForm.getRawValue();
    const dto = {
      numero_gestacion: formValues.numero_gestacion,
      fecha_probableparto: formValues.fecha_probableparto || null,
      factor_riesgo: formValues.factor_riesgo?.trim() || null,
      observacion: formValues.observacion?.trim() || null,
    };

    const request$: Observable<ProgramaDiagnostico> = this.isEditMode && this.programaId
      ? this.programaService.updatePrograma(this.programaId, dto)
      : this.programaService.createPrograma(this.pacienteVinculado!.historial_medico.id_historialmedico, dto);

    const successMsg = this.isEditMode
      ? 'Programa actualizado exitosamente.'
      : `Programa registrado exitosamente para ${this.pacienteVinculado?.nombre} ${this.pacienteVinculado?.apellido}.`;

    request$.subscribe({
      next: () => {
        this.successMessage = successMsg;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/diagnostico']), 1500);
      },
      error: (err) => {
        console.error('Error en la operación:', err);
        this.errorMessage = err.error?.message || 'Error al procesar la solicitud. Intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  get canSubmit(): boolean {
    return this.programaForm.valid && 
           (this.isEditMode || !!this.pacienteVinculado?.historial_medico?.id_historialmedico);
  }
}