import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs'; 
// ELIMINAMOS: import { HistorialMedicoService } from '../../services/historial-medico.service'; 
import { PacienteService } from '../../../Paciente/services/paciente.service';
import { PacienteData } from '../../../Paciente/model/paciente-historial'; // <--- 1. Importar PacienteData
import { ProgramaDiagnosticoService } from '../../services/programadiagnostico.service';
import { 
  ProgramaDiagnostico, 
  CreateProgramaDiagnosticoDto,
  Estado 
} from '../../model/programadiagnostico'; 

// 2. Definimos un nuevo tipo que extiende PacienteData con la propiedad historialMedico, 
//    para que TypeScript no se queje al acceder a ella.
type PacienteConHistorial = PacienteData & {
    historialMedico: {
        id_historialmedico: string;
    };
};

@Component({
  selector: 'app-registro-programa-diagnostico',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './registro-programa-diagnostico.component.html',
  styleUrl: './registro-programa-diagnostico.component.css'
})
export class RegistroProgramaDiagnosticoComponent implements OnInit {

  // --- ESTADOS DEL COMPONENTE ---
  programaForm!: FormGroup; 
  searchForm!: FormGroup; 
  
  isEditMode = false;
  isSearchMode = true; 
  
  programaId: string | null = null;
  
  // 3. Usamos el nuevo tipo que sabemos que contiene el historial
  pacienteEncontrado: PacienteConHistorial | null = null; 
  
  // --- ESTADOS DE UI ---
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  pacienteNombreCompleto: string = 'Paciente'; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private programaService: ProgramaDiagnosticoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.programaId = this.route.snapshot.paramMap.get('id'); 
    this.isEditMode = !!this.programaId;
    
    this.initProgramaForm();
    this.initSearchForm();

    if (this.isEditMode && this.programaId) {
      // MODO EDICIÓN: Salta la búsqueda
      this.isSearchMode = false; 
      this.loadProgramaParaEdicion(this.programaId);
    } else {
      // MODO REGISTRO: Inicia con la búsqueda de DNI.
      this.isSearchMode = true;
      this.errorMessage = null; 
    }
  }

  // 1. Inicializa el formulario de BÚSQUEDA
  initSearchForm(): void {
    this.searchForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]], 
    });
  }

  // 2. Inicializa el formulario de PROGRAMA DIAGNÓSTICO
  initProgramaForm(): void {
    this.programaForm = this.fb.group({
      numero_gestacion: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      fecha_probableparto: [''], 
      factor_riesgo: [''], 
      observacion: ['', [Validators.maxLength(1000)]], 
    });
  }
  
  // 3. Lógica de BÚSQUEDA DE PACIENTE POR DNI (Usando PacienteService)
  buscarPaciente(): void {
    this.errorMessage = null;
    if (this.searchForm.invalid) {
        this.errorMessage = 'Ingrese un DNI válido.';
        this.searchForm.markAllAsTouched();
        return;
    }
    
    this.isLoading = true;
    const dni = this.searchForm.get('dni')?.value;

    this.pacienteService.buscarPacientePorDni(dni).subscribe({
      // 4. Usamos el tipo PacienteData | null que el Observable realmente emite
      next: (pacienteData: PacienteData | null) => {
        
        if (!pacienteData) {
            this.errorMessage = 'No se encontró Paciente activo con ese DNI.';
            this.pacienteEncontrado = null;
            this.isSearchMode = true;
            this.isLoading = false;
            return;
        }



        // 5. Aplicamos una aserción de tipo para usar la estructura conocida
        const pacienteConHistorial = pacienteData as PacienteConHistorial;

        // Validación CRÍTICA: Ahora usamos pacienteConHistorial, que tiene la propiedad
        if (!pacienteConHistorial.historialMedico || !pacienteConHistorial.historialMedico.id_historialmedico) {
            this.errorMessage = 'Paciente encontrado, pero no tiene un Historial Médico activo asociado. Por favor, registre uno primero.';
            this.pacienteEncontrado = null;
            this.isSearchMode = true; // ⬅️ Vuelve al modo Búsqueda
        } else {
            // Paso 3: Historial VÁLIDO. Muestra el formulario de registro.
            this.pacienteEncontrado = pacienteConHistorial;
            this.isSearchMode = false; // ⬅️ Pasa al modo Registro
            this.errorMessage = null; 
        }
        
        this.pacienteEncontrado = pacienteConHistorial;
        this.pacienteNombreCompleto = `${pacienteConHistorial.nombre} ${pacienteConHistorial.apellido}`;
        this.isSearchMode = false; // Pasar al paso 2: Formulario de Registro
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error en búsqueda de paciente:', err);
        this.errorMessage = err.error?.message || 'Error al comunicarse con el servidor durante la búsqueda.';
        this.isLoading = false;
        this.pacienteEncontrado = null;
      }
    });
  }
  
  // 4. Lógica de CARGA para el MODO EDICIÓN (No cambia)
  loadProgramaParaEdicion(id: string): void {
    this.isLoading = true;
    this.programaService.getProgramaById(id).subscribe({
      next: (programa: ProgramaDiagnostico) => {
        
        if (programa.estado !== 'ACTIVO') {
            alert('Solo se pueden editar programas con estado ACTIVO.');
            this.router.navigate(['/diagnostico']);
            return;
        }

        this.programaForm.patchValue({
          numero_gestacion: programa.numero_gestacion,
          fecha_probableparto: programa.fecha_probableparto ? this.formatDateForInput(programa.fecha_probableparto) : '',
          factor_riesgo: programa.factor_riesgo,
          observacion: programa.observacion,
        });
        
        // Obtener el nombre del paciente del historial asociado
        this.pacienteNombreCompleto = `${programa.paciente?.nombre} ${programa.paciente?.apellido}`;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el programa. Verifique el ID.';
        this.isLoading = false;
        console.error('Error de carga:', err);
      }
    });
  }

  // Función auxiliar para formatear fecha (No cambia)
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // 5. Maneja el envío del formulario (Crear o Editar)
  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.programaForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      this.programaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const dto: CreateProgramaDiagnosticoDto = this.programaForm.value;

    let request: Observable<ProgramaDiagnostico>;

    if (this.isEditMode && this.programaId) {
      // Modo Edición: Usamos el ID del programa
      request = this.programaService.updatePrograma(this.programaId, dto);
    } else if (this.pacienteEncontrado) {
      // Modo Registro: Usamos el ID del historial encontrado
      const historialId = this.pacienteEncontrado.historialMedico.id_historialmedico;
      request = this.programaService.createPrograma(historialId, dto); // ¡Usamos el ID del historial!
    } else {
        this.errorMessage = 'Error: No se ha seleccionado un Historial Médico válido para el registro.'; 
        this.isSubmitting = false;
        return;
    }
    
    // Ejecutar la solicitud
    request.subscribe({
      next: () => {
        alert(`Programa de Diagnóstico ${this.isEditMode ? 'actualizado' : 'registrado'} con éxito.`);
        this.router.navigate(['/diagnostico']); 
      },
      error: (err: any) => {
        console.error(`Error al ${this.isEditMode ? 'editar' : 'registrar'} programa:`, err);
        this.errorMessage = err.error?.message || `Error en la operación. Verifique los datos.`;
        this.isSubmitting = false;
      }
    });
  }

  // 6. Navegación de vuelta/Cambio de paciente
  onBack(): void {
    this.router.navigate(['/diagnostico']);
  }
  
  // Función para volver al modo de búsqueda (solo en modo registro)
  volverABusqueda(): void {
      this.isSearchMode = true;
      this.pacienteEncontrado = null;
      this.pacienteNombreCompleto = 'Paciente';
      this.programaForm.reset();
  }
}
