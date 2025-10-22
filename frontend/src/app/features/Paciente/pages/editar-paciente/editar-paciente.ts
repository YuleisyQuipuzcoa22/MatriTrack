import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PacienteData } from '../../model/paciente-historial';

@Component({
  selector: 'app-editar-paciente',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './editar-paciente.html',
})
export class EditarPaciente implements OnInit {
  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  pacienteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Necesario para cargar datos, aunque esté deshabilitado
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fecha_nacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9+ ]{9,15}$')]],
      direccion: ['', [Validators.required, Validators.minLength(6)]],
      // No incluimos estado ni fecha_inhabilitacion aquí ya que se manejan en otro lado
    });
    this.pacienteId = this.route.snapshot.paramMap.get('id')
    if (this.pacienteId) {
      // 2. Corregido: Llamar a loadUserData con el ID correcto
      this.loadUserData(this.pacienteId);
    } else {
      this.errorMessage = 'ID de paciente no proporcionado en la URL.';
    }
    this.disableRegistrationFields();
  }
  private disableRegistrationFields(): void {
    this.registerForm.get('dni')?.disable();
  }
  private loadUserData(id_paciente: string): void {
    this.isLoading = true;
    this.pacienteService.getPacienteById(id_paciente).subscribe({
      next: (paciente: PacienteData) => {
        const fechaNacimientoFormateada = paciente.fecha_nacimiento.split('T')[0];

        this.registerForm.patchValue({
          dni: paciente.dni,
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          fecha_nacimiento: fechaNacimientoFormateada,
          sexo: paciente.sexo,
          correo_electronico: paciente.correo_electronico,
          telefono: paciente.telefono,
          direccion: paciente.direccion,
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del paciente:', err);
        this.errorMessage = 'No se pudieron cargar los datos del paciente para edición.';
        this.isLoading = false;
      },
    });
  }
  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.pacienteId) {
      this.errorMessage = 'Error: ID de paciente no encontrado para la actualización.';
      return;
    }

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Al usar getRawValue() se incluyen los campos deshabilitados (como 'dni')
    const fullData = this.registerForm.getRawValue();

    // Creamos el DTO de actualización que solo debería contener los campos permitidos por UpdatePacienteDto
    // y excluye el DNI que no es actualizable en el DTO
    const updateDto = {
      nombre: fullData.nombre,
      apellido: fullData.apellido,
      fecha_nacimiento: fullData.fecha_nacimiento,
      direccion: fullData.direccion,
      sexo: fullData.sexo,
      telefono: fullData.telefono,
      correo_electronico: fullData.correo_electronico,
      // No enviamos el DNI ya que no está en el DTO de actualización
    };

    console.log(
      `📤 Datos a enviar para paciente ${this.pacienteId}:`,
      JSON.stringify(updateDto, null, 2)
    );

    this.pacienteService.modificarPaciente(this.pacienteId, updateDto).subscribe({
      next: (response) => {
        console.log('✅ Paciente actualizado exitosamente:', response);
        this.successMessage = `Paciente ${response.nombre} actualizado exitosamente.`;
        this.isLoading = false;

        // Limpiar mensajes y redirigir
        setTimeout(() => {
          this.router.navigate(['/pacientes']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error en la actualización:', err);
        this.isLoading = false;

        // Manejo de errores
        if (err.status === 400 || err.status === 409) {
          const errorMsg = err.error?.message;
          if (typeof errorMsg === 'string') {
            this.errorMessage = errorMsg;
          } else if (Array.isArray(errorMsg)) {
            this.errorMessage = errorMsg.join(', ');
          } else {
            this.errorMessage =
              'Error de validación o conflicto de datos. Verifique la información.';
          }
        } else {
          this.errorMessage = 'Error al actualizar el paciente. Intente nuevamente.';
        }
      },
    });
  }
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Ingrese un correo válido';
    if (control.errors['pattern']) return 'Formato inválido';
    if (control.errors['minLength'])
      return `Mínimo ${control.errors['minLength'].requiredLength} caracteres`;

    return 'Error en el campo';
  }
}
