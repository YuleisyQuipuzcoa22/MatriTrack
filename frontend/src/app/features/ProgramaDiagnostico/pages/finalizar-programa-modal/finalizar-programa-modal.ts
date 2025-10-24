import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgramaDiagnostico, MotivoFin, FinalizarProgramaDiagnosticoDto } from '../../model/programadiagnostico';
import { ProgramaDiagnosticoService } from '../../services/programadiagnostico.service';
@Component({
  selector: 'app-finalizar-programa-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './finalizar-programa-modal.html',
  styleUrl: './finalizar-programa-modal.css', 
})
export class FinalizarProgramaModalComponent implements OnInit {
  
  // Input: Recibe el programa que se va a finalizar
  @Input() programa!: ProgramaDiagnostico;
  
  // Output: Emite el evento de finalización exitosa (para recargar la lista)
  @Output() finalizacionExitosa = new EventEmitter<void>();
  
  // Output: Emite la señal de que el modal debe cerrarse (manejado por el componente padre)
  @Output() closeModal = new EventEmitter<void>();

  finalizarForm!: FormGroup;
  motivos = Object.values(MotivoFin);
  
  isLoading = false;
  errorMessage: string | null = null;
  
  // Enum disponible en el template
  MotivoFin = MotivoFin; 

  constructor(
    private fb: FormBuilder,
    private programaDiagnosticoService: ProgramaDiagnosticoService 
  ) {}

  ngOnInit(): void {
    this.finalizarForm = this.fb.group({
      motivo_finalizacion: ['', Validators.required],
      motivo_otros: [''], // Inicialmente vacío
    });
    
    // Observar cambios en el motivo para aplicar la validación condicional
    this.finalizarForm.get('motivo_finalizacion')?.valueChanges.subscribe(motivo => {
      this.handleMotivoChange(motivo);
    });
  }
  
  // Lógica de negocio crucial: 'OTROS' requiere un motivo adicional
  private handleMotivoChange(motivo: MotivoFin): void {
    const motivoOtrosControl = this.finalizarForm.get('motivo_otros');
    if (!motivoOtrosControl) return;

    if (motivo === MotivoFin.OTROS) {
      // Requerido: Mínimo 1 caracter, Máximo 100 (basado en el backend)
      motivoOtrosControl.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(100)]);
    } else {
      motivoOtrosControl.clearValidators();
      motivoOtrosControl.setValue(''); // Limpiar si cambia a otro motivo
    }
    motivoOtrosControl.updateValueAndValidity();
  }

  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.finalizarForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      return;
    }

    this.isLoading = true;
    const dto: FinalizarProgramaDiagnosticoDto = this.finalizarForm.value;

    this.programaDiagnosticoService.finalizar(this.programa.id_programadiagnostico, dto).subscribe({
      next: () => {
        // Éxito: Emitir evento para que la lista principal recargue y cerrar modal
        this.finalizacionExitosa.emit();
        this.isLoading = false;
        // Esperar un momento antes de cerrar, para mostrar el éxito si es necesario
        setTimeout(() => this.closeModal.emit(), 500);
      },
      error: (err) => {
        console.error('Error al finalizar programa:', err);
        this.errorMessage = err.error?.message || 'Error al finalizar el programa. Verifique los datos.';
        this.isLoading = false;
      },
    });
  }
  
  onClose(): void {
    this.closeModal.emit();
  }
}