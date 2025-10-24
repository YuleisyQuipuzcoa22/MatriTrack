import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramaDiagnostico, Estado, MotivoFin } from '../../model/programadiagnostico';

@Component({
  selector: 'app-detalle-programa-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-programa-modal.html',
  styleUrl: './detalle-programa-modal.css', // Usaremos un CSS simple basado en el modal anterior
})
export class DetalleProgramaModalComponent implements OnInit {
  
  // Recibe el programa a mostrar
  @Input() programa!: ProgramaDiagnostico;
  
  // Emite la señal de que el modal debe cerrarse
  @Output() closeModal = new EventEmitter<void>();

  // Helper para mostrar datos en el template
  Estado = Estado; 
  MotivoFin = MotivoFin;

  constructor() {}

  ngOnInit(): void {
    if (!this.programa) {
        console.error('El componente DetalleProgramaModalComponent requiere un objeto programa.');
    }
  }
  
  // Función para cerrar el modal
  onClose(): void {
    this.closeModal.emit();
  }
  
  // Función auxiliar para formatear la fecha a un formato legible (dd/MM/yyyy)
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (e) {
      return dateString; // Devuelve el string si hay error de formato
    }
  }
}