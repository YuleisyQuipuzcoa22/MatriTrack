import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Para la navegación
import { ProgramaDiagnosticoService } from '../../services/programadiagnostico.service'; // Asegúrate de la ruta correcta
import { 
  ProgramaDiagnostico, 
  Estado, 
  FiltrosPrograma 
} from '../../model/programadiagnostico';

// Importar los componentes modales
import { FinalizarProgramaModalComponent } from '../finalizar-programa-modal/finalizar-programa-modal';
import { DetalleProgramaModalComponent } from '../detalle-programa-modal/detalle-programa-modal';

@Component({
  selector: 'app-programa-diagnostico-list',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FinalizarProgramaModalComponent,
    DetalleProgramaModalComponent
  ],
  templateUrl: './programa-diagnostico-list.component.html',
  styleUrl: './programa-diagnostico-list.component.css'
})
export class ProgramaDiagnosticoListComponent implements OnInit {

  // Listado principal
  programas: ProgramaDiagnostico[] = [];
  
  // Estado de la UI
  isLoading = false;
  errorMessage: string | null = null;
  totalProgramas = 0;

  // Formulario de Filtros
  filtroForm!: FormGroup;
  estadosDisponibles = ['TODOS', Estado.ACTIVO, Estado.INACTIVO, Estado.FINALIZADO];
  
  // Control de Modales
  showFinalizarModal = false; 
  programaToFinalizar: ProgramaDiagnostico | null = null;
  showDetalleModal = false;
  programaToDetail: ProgramaDiagnostico | null = null;
  
  // Enum disponible en el template para la lógica de los botones
  Estado = Estado; 

  constructor(
    private fb: FormBuilder,
    private programaService: ProgramaDiagnosticoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFiltroForm();
    this.loadProgramas();
  }

  // Inicializa el formulario de filtros (similar a 'listado-obstetras.html')
  private initFiltroForm(): void {
    this.filtroForm = this.fb.group({
      nombre: [''],
      dni: [''],
      estado: ['ACTIVO'], // Valor por defecto
    });
    
    // Opcional: Cargar programas cada vez que cambia un filtro
    this.filtroForm.valueChanges.subscribe(() => {
        this.loadProgramas();
    });
  }

  // Llama al servicio para obtener la lista de programas
  loadProgramas(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const filtros: FiltrosPrograma = this.filtroForm.value;
    
    // Limpiar campos vacíos antes de enviar
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([, value]) => value && value !== 'TODOS')
    ) as FiltrosPrograma;

    this.programaService.getProgramas(filtrosLimpios).subscribe({
      next: (data) => {
        this.programas = data;
        this.totalProgramas = data.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar programas:', err);
        this.errorMessage = 'No se pudieron cargar los programas. Intente de nuevo.';
        this.isLoading = false;
        this.programas = []; // Limpiar lista en caso de error
      }
    });
  }

  // ************ ACCIONES DE LAS TARJETAS ************

  // 1. Ver Detalle (Muestra el modal)
  verDetalle(programa: ProgramaDiagnostico): void {
    this.programaToDetail = programa;
    this.showDetalleModal = true;
  }
  
  handleCloseDetalleModal(): void {
      this.showDetalleModal = false;
      this.programaToDetail = null;
  }
  
  // 2. Finalizar Programa (Muestra el modal)
  finalizarPrograma(programa: ProgramaDiagnostico): void {
    // Solo permitir finalizar si el estado es ACTIVO
    if (programa.estado === Estado.ACTIVO) {
        this.programaToFinalizar = programa;
        this.showFinalizarModal = true;
    }
  }
  
  handleCloseFinalizarModal(): void {
      this.showFinalizarModal = false;
      this.programaToFinalizar = null;
  }
  
  // 3. Maneja la finalización exitosa (Recarga la lista)
  handleFinalizacionExitosa(): void {
      this.loadProgramas(); 
  }

  // 4. Editar Programa (Navegación)
  editarPrograma(programa: ProgramaDiagnostico): void {
    // Solo permitir editar si el estado es ACTIVO
    if (programa.estado === Estado.ACTIVO) {
        this.router.navigate(['/programas/editar', programa.id_programadiagnostico]);
    } else {
        alert('Solo se pueden editar programas con estado ACTIVO.');
    }
  }

  // 5. Activar/Habilitar Programa (Acción directa)
  activarPrograma(programa: ProgramaDiagnostico): void {
    if (programa.estado !== Estado.ACTIVO) {
        if (confirm(`¿Está seguro de habilitar el programa de ${programa.historialMedico.paciente.nombre}?`)) {
            this.programaService.activar(programa.id_programadiagnostico).subscribe({
                next: () => {
                    this.loadProgramas(); // Recargar la lista
                    alert('Programa activado con éxito.');
                },
                error: (err) => {
                    console.error('Error al activar programa:', err);
                    alert(err.error?.message || 'Error al activar el programa.');
                }
            });
        }
    }
  }

  // 6. Ver Controles (Navegación al módulo de Controles)
  verControles(programa: ProgramaDiagnostico): void {
    this.router.navigate(['/controles-diagnostico', programa.id_programadiagnostico]);
  }
  
  goToRegistro(): void {
    this.router.navigate(['/diagnostico/registrar']);
  }
}