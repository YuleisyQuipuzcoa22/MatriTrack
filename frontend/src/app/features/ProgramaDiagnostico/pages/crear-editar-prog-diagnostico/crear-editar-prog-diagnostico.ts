import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  //datos de edición/creación
  isEditMode = false; // true  detectas edición
  programaId: string | null = null;

  // Datos para el modo Creación
  // Guardamos el historialId temporalmente para el registro
  private historialId: string | null = null;
  pacienteVinculado: PacienteData | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private programaService: ProgramaDiagnosticoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.programaForm = this.fb.group({
      //para vincular al paciente
      dni: ['', [Validators.pattern('^[0-9]{8}$')]],

      numero_gestacion: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      fecha_probableparto: [''],
      factor_riesgo: [''],
      observacion: ['', [Validators.maxLength(1000)]],
    });
    //determinar si es modo edición o creacion

    this.programaId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.programaId;

    if (this.isEditMode) {
      // Modo Edición
      this.programaForm.get('dni')?.setValidators([]); // El DNI no es relevante en edición
      this.programaForm.get('dni')?.updateValueAndValidity();
      this.loadProgramaData(this.programaId!);
    } else {
      // Modo Creación: El DNI es obligatorio antes de enviar
      this.programaForm
        .get('dni')
        ?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}$')]);
      this.programaForm.get('dni')?.updateValueAndValidity();
      // Deshabilita los campos del programa hasta que se encuentre el paciente
      this.disableProgramaFields(true);
    }
  }
  // Deshabilita/Habilita los campos del programa (no el DNI)
   disableProgramaFields(disable: boolean) {
    if (disable) {
      this.programaForm.get('numero_gestacion')?.disable();
      this.programaForm.get('fecha_probableparto')?.disable();
      // ... otros campos del programa
    } else {
      this.programaForm.get('numero_gestacion')?.enable();
      this.programaForm.get('fecha_probableparto')?.enable();
      // ...
    }
  }
  // Carga los datos del programa para la edición
  private loadProgramaData(id_programa: string): void {
    this.isLoading = true;
    this.programaService.getProgramaById(id_programa).subscribe({
      next: (programa: ProgramaDiagnostico) => {
        // Formatear fecha para el input type="date"
        const fechaPartoFormateada = programa.fecha_probableparto?.split('T')[0] || '';

        // Solo actualiza los campos del DTO de programa
        this.programaForm.patchValue({
          numero_gestacion: programa.numero_gestacion,
          fecha_probableparto: fechaPartoFormateada,
          factor_riesgo: programa.factor_riesgo,
          observacion: programa.observacion,
        });

        // Habilita los campos del programa para edición
        this.disableProgramaFields(false);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del programa:', err);
        this.errorMessage = 'No se pudieron cargar los datos del programa para edición.';
        this.isLoading = false;
      },
    });
  }

  // Busca el paciente por DNI (solo en modo Creación)
  buscarPacientePorDni(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.historialId = null;
    this.pacienteVinculado = null;
    this.disableProgramaFields(true); // Deshabilita mientras busca

    const dniControl = this.programaForm.get('dni');
    if (!dniControl || dniControl.invalid) {
      dniControl?.markAsTouched();
      this.errorMessage = 'Ingrese un DNI válido de 8 dígitos.';
      return;
    }

    const dni = dniControl.value;
    this.isSearchingPatient = true;

    this.pacienteService.buscarPacientePorDni(dni).subscribe({
      next: (paciente) => {
        this.isSearchingPatient = false;
        if (paciente && paciente.historial_medico.id_historialmedico) {
          this.pacienteVinculado = paciente;
          this.historialId = paciente.historial_medico.id_historialmedico;
          this.disableProgramaFields(false); // Habilita los campos
          this.successMessage = `Paciente ${paciente.nombre} ${paciente.apellido} encontrado. Complete los detalles del programa.`;
        } else {
          this.pacienteVinculado = null;
          this.historialId = null;
          this.errorMessage = `No se encontró un paciente activo con el DNI ${dni}.`;
          this.disableProgramaFields(true);
        }
      },
      error: (err) => {
        this.isSearchingPatient = false;
        console.error('Error al buscar paciente:', err);
        this.errorMessage = 'Ocurrió un error al intentar buscar el paciente.';
        this.disableProgramaFields(true);
      },
    });
  }

  onSubmit(): void {
     this.successMessage = null;
    this.errorMessage = null;

    // Valida que el formulario (incluyendo los campos del programa) sea válido
    if (this.programaForm.invalid) {
       this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      this.programaForm.markAllAsTouched();
      return;
    }

    // En modo creación, valida que el paciente esté vinculado
    if (!this.isEditMode && !this.historialId) {
      this.errorMessage ='Debe vincular un paciente válido antes de registrar el programa.';
      return;
    }

    this.isLoading = true;

    // DTO de datos comunes
     const formValues = this.programaForm.getRawValue();
    const commonDto = {
      numero_gestacion: formValues.numero_gestacion,
      fecha_probableparto: formValues.fecha_probableparto || undefined,
      factor_riesgo: formValues.factor_riesgo || undefined,
      observacion: formValues.observacion || undefined,
    };

    let request$: Observable<any>;
    let successMsg: string;

     if (this.isEditMode && this.programaId) {
      // Modo Edición: Usamos el objeto plano
      const updateDto = commonDto;
      request$ = this.programaService.updatePrograma(this.programaId, updateDto);
      successMsg = 'Programa diagnóstico actualizado exitosamente.';
    } else if (this.historialId) {
      // Modo Creación: Usamos el objeto plano
      // Usamos 'this.idHistorial!' ya que la validación anterior garantiza que existe
      request$ = this.programaService.createPrograma(this.historialId!, commonDto);
      successMsg = `Programa diagnóstico registrado exitosamente para ${this.pacienteVinculado?.nombre || 'el paciente vinculado'}.`;
    } else {
      // Fallback
      this.isLoading = false;
      this.errorMessage = 'Error interno: No se pudo obtener el historial del paciente para el registro.';
      return;
    }

    request$.subscribe({
      next: (response) => {
        console.log('✅ Respuesta de la operación:', response);
        // Uso de asignación directa
        this.successMessage = successMsg;
        this.isLoading = false;

        if (!this.isEditMode) {
          // Si es un nuevo registro, limpiamos y redirigimos
          this.programaForm.reset({ dni: '' });
          // Uso de asignación directa
          this.pacienteVinculado = null;
          this.historialId = null;
          this.disableProgramaFields(true);
        }

        setTimeout(() => this.router.navigate(['/diagnostico']), 1500);
      },
      error: (err) => {
        console.error('❌ Error en la operación:', err);
        // Uso de asignación directa
        this.errorMessage =
          err.error?.message || 'Error en la operación. Verifique los datos e intente de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
