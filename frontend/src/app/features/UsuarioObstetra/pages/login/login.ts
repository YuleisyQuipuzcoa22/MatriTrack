import { Component, OnDestroy, inject, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  dni: string = '';
  contrasena: string = '';
  privacy: boolean = false;
  maxAttempts = 3;
  attempts = 0;
  isBlocked = false;
  blockTime = 30;
  remainingTime = 0;
  intervalId: any;
  showPassword = false;
  errorMessage: string | null = null;
  submitted = false;
  recaptchaToken: string | null = null;
  recaptchaWidgetId: number | null = null;

  private readonly siteKey: string = '6LfoWeIrAAAAAEIu9FcWgkamGX1joqr1Yz-5FPEC';

  //PLATFORM_ID : token especial que indica el entorno actual de ejecucion =>
  //BROWSER = NAVEGADOR
  //SERVER = SERVIDOR (SSR)
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    //SOLO DEVUELVE TRUE SI EL CODIGO SE EJECUTA EN NAVEGADOR
    //PUERTA DE ENTRADA PARA RECIBIR EL TOKEN QUE VIENE DE GOOGLE
    //USAMOS WINDOW PARA EXPONER SUS FUNCIONES DE GOOGLE A NUESTRA APLICACION
    if (isPlatformBrowser(this.platformId)) {
      // La función global que Google llama cuando su script termina de cargar
      (window as any)['onloadRecaptchaScript'] = () => {
        console.log('Script de reCAPTCHA cargado globalmente.');
        // Llamamos a un método del componente si está en el DOM
        const component = (window as any)['activeLoginComponent'];
        if (component) {
          component.renderRecaptchaWidget();
        }
      };
    }
  }

  // Inicialización del Componente (Solo Referencia Global)
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Hacemos referencia a esta instancia para que la función global la encuentre
      (window as any)['activeLoginComponent'] = this;
    }
  }

  //Esperamos a que el DOM esté listo
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Envolvemos la inicialización en un setTimeout(0) para garantizar que el DOM esté 100% listo.
      // Esto resuelve el error "reCAPTCHA placeholder element must be an element or id".
      setTimeout(() => {
        if ((window as any).grecaptcha && this.recaptchaWidgetId === null) {
          this.renderRecaptchaWidget();
        }
      }, 0);
    }
  }

  //Inicialización Programática del Widget (Función Clave)
  public renderRecaptchaWidget(): void {
    // Verificamos si ya está renderizado
    if (this.recaptchaWidgetId !== null) return;

    // Verificamos si estamos en el navegador y si grecaptcha está disponible
    if (isPlatformBrowser(this.platformId) && (window as any).grecaptcha) {
      try {
        // 1. Renderiza el widget en el div con id='recaptcha-widget'
        this.recaptchaWidgetId = (window as any).grecaptcha.render('recaptcha-widget', {
          sitekey: this.siteKey,
          // 2. El callback apunta a un método del componente para guardar el token
          callback: (token: string) => this.handleRecaptcha(token),
          'expired-callback': () => (this.recaptchaToken = null),
        });
        console.log('reCAPTCHA widget renderizado con ID:', this.recaptchaWidgetId);
      } catch (e) {
        console.error('Error al renderizar reCAPTCHA:', e);
      }
    }
  }

  //Reseteo del Widget
  private resetRecaptcha(): void {
    // Usamos el ID del widget para resetear la instancia específica
    if (
      isPlatformBrowser(this.platformId) &&
      (window as any).grecaptcha &&
      this.recaptchaWidgetId !== null
    ) {
      try {
        (window as any).grecaptcha.reset(this.recaptchaWidgetId);
        this.recaptchaToken = null;
        console.log('reCAPTCHA widget reseteado.');
      } catch (e) {
        console.warn(
          'reCAPTCHA no pudo ser reseteado. El widget puede no estar totalmente renderizado.',
          e
        );
      }
    }
  }
  handleRecaptcha(response: string): void {
    this.recaptchaToken = response;
    console.log('Recaptcha token capturado:', response);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: any): void {
    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid || !this.privacy) {
      if (!this.privacy) {
        this.errorMessage = 'Debes aceptar las políticas de privacidad.';
      } else {
        this.errorMessage = 'Por favor, rellene todos los campos.';
      }
      return;
    }

    const currentToken = this.recaptchaToken || (window as any).grecaptcha?.getResponse();
    /*usas window para acceder a grecaptcha porque es el contrato de programación que 
Google usa para que accedas a sus funciones de verificación desde el lado del cliente. 
Es la única forma de obtener el token de reCAPTCHA */

    if (!currentToken) {
      // Modificado de `!this.recaptchaToken` a `!currentToken` para verificar el valor final.
      this.errorMessage = 'Por favor, complete la verificación reCAPTCHA.';
      return;
    }

    if (this.isBlocked) {
      this.errorMessage = `Demasiados intentos fallidos. Vuelva a intentarlo en ${this.remainingTime} segundos.`;
      return;
    }

    this.authService.login(this.dni, this.contrasena, currentToken).subscribe({
      next: (response) => {
        console.log('Login exitoso. Rol:', response.rol);
        this.resetLogin();
        this.redirectToRole(response.rol);
      },
      error: (err) => {
        const apiMessage = err.error?.message || 'Credenciales inválidas.';
        this.handleFailedAttempt(apiMessage);
        this.contrasena = '';

        // Reseteamos reCAPTCHA para un nuevo intento
        this.resetRecaptcha();
      },
    });
  }

  private handleFailedAttempt(message: string): void {
    this.attempts++;

    if (this.attempts >= this.maxAttempts) {
      this.blockUser();
      this.errorMessage = `Cuenta bloqueada temporalmente.`;
    } else {
      this.errorMessage = `${message} Intentos restantes: ${this.maxAttempts - this.attempts}.`;
    }
  }

  private blockUser(): void {
    this.isBlocked = true;
    this.remainingTime = this.blockTime;

    this.intervalId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.intervalId);
        this.isBlocked = false;
        this.attempts = 0;
        this.errorMessage = null;
      }
    }, 1000);
  }

  private resetLogin(): void {
    this.attempts = 0;
    this.isBlocked = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.dni = '';
    this.contrasena = '';
    this.submitted = false;
    this.privacy = false;
  }

  // --- INICIO DE LA CORRECCIÓN ---
  // Apunta a las rutas correctas de 'app.routes.ts'
  private redirectToRole(rol: string): void {
    // Convertimos a minúsculas para una comparación segura
    const rolLower = rol.toLowerCase().trim();

    if (rolLower === 'administrador') {
      this.router.navigate(['/obstetras']); 
    } else if (rolLower === 'obstetra') {
      this.router.navigate(['/pacientes']);
    } else {
      // Ruta por defecto si el rol no es ninguno
      this.router.navigate(['/login']);
    }
  }
  // --- FIN DE LA CORRECCIÓN ---

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (isPlatformBrowser(this.platformId) && (window as any)['activeLoginComponent'] === this) {
      delete (window as any)['activeLoginComponent'];
    }
  }
}