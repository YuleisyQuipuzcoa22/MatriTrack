import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-crear-paciente-historial',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './crear-paciente-historial.html',
})
export class CrearPacienteHistorial implements OnInit {
  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  // Opciones para el select de Tipo de Sangre (deben coincidir con el enum del backend)
  tiposSangre: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // Datos del Paciente
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fecha_nacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9+ ]{9,15}$')]],
      direccion: ['', [Validators.required, Validators.minLength(6)]],

      // Datos del Historial Médico (FormGroup anidado)
      historial_medico: this.fb.group({
        tipo_sangre: ['', Validators.required],
        antecedente_medico: [''],
        alergia: [''],
      }),
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    //ENVÍA TAL CUAL (estructura anidada)
    const dataToSend = this.registerForm.value;

    console.log('📤 Datos a enviar:', JSON.stringify(dataToSend, null, 2));

    this.pacienteService.registrarPaciente(dataToSend).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        this.successMessage = `Paciente registrado exitosamente con ID: ${response.id_paciente}`;
        this.isLoading = false;

        // Limpiar formulario
        this.registerForm.reset();
        this.registerForm.patchValue({
          sexo: '',
          historial_medico: { tipo_sangre: '' },
        });

        // Opcional: redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/pacientes']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error en el registro:', err);
        this.isLoading = false;

        // Manejo específico de errores
        if (err.status === 400) {
          // Error de validación
          const errorMsg = err.error?.message;
          if (typeof errorMsg === 'string') {
            this.errorMessage = errorMsg;
          } else if (Array.isArray(errorMsg)) {
            this.errorMessage = errorMsg.join(', ');
          } else {
            this.errorMessage = 'Error de validación. Verifique los datos ingresados.';
          }
        } else if (err.status === 409) {
          // Conflicto (DNI o email duplicado)
          this.errorMessage = err.error?.message || 'El DNI o correo ya están registrados.';
        } else {
          this.errorMessage = 'Error al registrar el paciente. Intente nuevamente.';
        }
      },
    });
  }
  // Helper para mostrar mensajes de error en el template
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Ingrese un correo válido';
    if (control.errors['pattern']) return 'Formato inválido';
    if (control.errors['minLength']) return `Mínimo ${control.errors['minLength'].requiredLength} caracteres`;

    return 'Error en el campo';
  }

}
