import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserData, UserObstetraService } from '../../services/user-obstetra.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registerEditar-user',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registerEditar-user.html',
  styleUrl: './registerEditar-user.css',
  standalone: true, // Asumimos que es un componente standalone
})
export class RegisterEditarUser implements OnInit {
  registerForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false; // Nuevo: Para mostrar un spinner // Roles que el Administrador puede asignar (Admin no puede registrarse a sí mismo)

  roles = ['Obstetra', 'Administrador'];

  isEditMode = false; // o true si detectas edición
  obstetraId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private obstetraService: UserObstetraService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rol: ['Obstetra', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9+ ]{9,15}$')]], // El control siempre existe; su validez cambia según el rol
      direccion: ['', Validators.required],
      numero_colegiatura: ['', [Validators.minLength(6)]],
      contrasena: [this.authService.generateSimplePassword(), Validators.required],
    });

    this.obstetraId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.obstetraId;
    if (this.isEditMode) {
      // Si estamos en modo edición, cargamos datos y deshabilitamos campos clave.
      this.loadUserData(this.obstetraId!);
      this.disableRegistrationFields();
    } // Ajusta validadores dinámicamente según el rol

    this.registerForm.get('rol')?.valueChanges.subscribe((rol) => {
      this.handleRolChange(rol);
    }); // Aplicar reglas iniciales

    this.handleRolChange(this.registerForm.get('rol')?.value);
  }
  /**
   * Deshabilita campos que no deben modificarse después del registro (solo si es edición).
   */
  private disableRegistrationFields(): void {
    this.registerForm.get('dni')?.disable(); // Removemos la contraseña del formulario de Edición

    this.registerForm.removeControl('contrasena');
  }
  private loadUserData(id_usuario: string): void {
    this.isLoading = true;
    this.obstetraService.getUsuarioById(id_usuario).subscribe({
      next: (user: UserData) => {
        // Formatear la fecha para que el input type="date" la acepte (YYYY-MM-DD)
        const fechaNacimientoFormateada = user.fecha_nacimiento.split('T')[0];

        this.registerForm.patchValue({
          dni: user.dni,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
          fecha_nacimiento: fechaNacimientoFormateada,
          correo_electronico: user.correo_electronico,
          telefono: user.telefono,
          direccion: user.direccion,
          numero_colegiatura: user.numero_colegiatura,
        });
        this.handleRolChange(user.rol);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario:', err);
        this.errorMessage = 'No se pudieron cargar los datos del usuario para edición.';
        this.isLoading = false;
      },
    });
  } // Cambia validadores sin remover el control (evita errores de control huérfano)

  private handleRolChange(rol: string): void {
    const colegiaturaControl = this.registerForm.get('numero_colegiatura');
    if (!colegiaturaControl) return;

    if (rol === 'Obstetra') {
      colegiaturaControl.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      // Administrador: puede ingresar colegiatura pero NO es obligatoria
      colegiaturaControl.clearValidators();
    } // Recalcular validez del control y del formulario

    colegiaturaControl.updateValueAndValidity({ emitEvent: false });
    Object.keys(this.registerForm.controls).forEach((k) =>
      this.registerForm.get(k)?.updateValueAndValidity({ emitEvent: false })
    );
  } // Genera nueva contraseña y la muestra en el formulario

  regeneratePassword(): void {
    // Solo si está en modo registro, no en edición (ya que se elimina el control)
    if (this.registerForm.get('contrasena')) {
      this.registerForm.patchValue({
        contrasena: this.authService.generateSimplePassword(),
      });
    }
  } // Envío del formulario

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      return;
    }

    this.isLoading = true;
    // OBTENER VALORES DEL FORMULARIO
    let formValues: any;
    if (this.isEditMode) {
      // Edición: Solo valores permitidos (sin DNI u otros q están deshabilitados)
      formValues = this.registerForm.getRawValue(); // Obtén TODOS los valores
      // Elimina campos que NO deben enviarse en edición
      delete formValues.dni;
      delete formValues.contrasena; // Ya no existe, pero por si acaso
    } else {
      //Registro: Todos los valores
      formValues = this.registerForm.getRawValue();
    }
    let request$: Observable<any>;
    let successMsg: string;
    if (this.isEditMode && this.obstetraId) {
      // Edición
      request$ = this.obstetraService.modificarUsuario(this.obstetraId, formValues);
      successMsg = `Usuario ${this.obstetraId} actualizado exitosamente.`;
    } else {
      // Registro
      request$ = this.obstetraService.registrarUsuario(formValues);
      successMsg = `Usuario registrado exitosamente. Contraseña generada: ${
        this.registerForm.get('contrasena')?.value
      }`;
    }

    request$.subscribe({
      next: (response) => {
        this.successMessage = successMsg;
        this.isLoading = false;

        if (!this.isEditMode) {
          // Si es un nuevo registro, reseteamos el formulario
          const newPassword = this.authService.generateSimplePassword();
          this.registerForm.reset({
            rol: 'Obstetra',
            contrasena: newPassword, // Mantener valores por defecto para que las validaciones funcionen
            dni: '',
            nombre: '',
            apellido: '',
            fecha_nacimiento: '',
            correo_electronico: '',
            telefono: '',
            direccion: '',
            numero_colegiatura: '',
          });
          this.handleRolChange('Obstetra');
        } // Si es Edición, podríamos navegar de vuelta a la lista

        if (this.isEditMode) {
          setTimeout(() => this.router.navigate(['/obstetras']), 1500);
        }
      },
      error: (err) => {
        console.error('Error en la operación:', err);
        this.errorMessage =
          err.error?.message || 'Error en la operación. Verifique los datos e intente de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
