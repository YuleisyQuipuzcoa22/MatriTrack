import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-paginacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './paginacion.html',
  styleUrl: './paginacion.css',
})
export class Paginacion {
  // Propiedades de ENTRADA (Input)
  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;
  @Input({ required: true }) totalItems!: number;

  @Input({ required: true })
  set pageSize(value: number) {
    this._pageSize = value;
  }
  get pageSize(): number {
    return this._pageSize;
  }
  private _pageSize!: number;

  // Propiedades de SALIDA (Output) - INICIALIZACIÓN CON TIPO EXPLÍCITO
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sizeChange: EventEmitter<number> = new EventEmitter<number>();

  public Math = Math;

  /**
   * Emite el nuevo número de página al componente padre.
   * @param page - El número de página al que navegar.
   */
  onIrAPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      // TypeScript ya no debería quejarse aquí
      this.pageChange.emit(page);
    }
  }

  /**
   * Maneja el evento de cambio del selector de tamaño de página.
   * @param newSizeValue - El valor (string) del select, ya que el select HTML lo devuelve como string.
   */
  onCambiarTamanoPagina(newSizeValue: string): void {
    // Convertir el string a número entero
    const size = parseInt(newSizeValue, 10);

    if (!isNaN(size) && size > 0) {
      // TypeScript ya no debería quejarse aquí
      this.sizeChange.emit(size);
    }
  }
}
