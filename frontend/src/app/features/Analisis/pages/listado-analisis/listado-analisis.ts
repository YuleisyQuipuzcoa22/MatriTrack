import { Component } from '@angular/core';
import { AnalisisFilters, AnalisisService } from '../../services/analisis.service';
import { Analisis } from '../../model/analisis';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Paginacion } from '../../../../components/paginacion/paginacion';

declare var bootstrap: any; // Para controlar el modal de Bootstrap

@Component({
  selector: 'app-listado-analisis',
  imports: [FormsModule, CommonModule, Paginacion, ReactiveFormsModule],
  templateUrl: './listado-analisis.html',
  styleUrls: ['../../../../styles/styleListadoCRUD.css', './listado-analisis.css'],
})
export class ListadoAnalisis {
  analisisList: Analisis[] = [];
  analisisSeleccionado: Analisis | null = null;
  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  conteoResultados = 0;

  // Filtros
  filtroNombreAnalisis = '';
  filtroEstado: 'todos' | 'A' | 'I' = 'todos';

  isLoading = false;
  hayFiltroActivo = false;

  // Variables del modal
  analisisForm!: FormGroup;
  isEditMode = false;
  analisisIdEditar: string | null = null;
  modalInstance: any;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private analisisService: AnalisisService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.initForm();
    this.cargarAnalisis();
  }
  //nicializar formulario
  initForm(): void {
    this.analisisForm = this.fb.group({
      nombre_analisis: ['', [Validators.required, Validators.maxLength(55)]],
      descripcion_analisis: ['', Validators.maxLength(155)],
    });
  }

  cargarAnalisis(): void {
    this.isLoading = true;

    const filters: AnalisisFilters = {
      page: this.currentPage,
      limit: this.pageSize,
    };
    if (this.filtroNombreAnalisis.trim()) {
      filters.nombreAnalisis = this.filtroNombreAnalisis.trim();
    }

    if (this.filtroEstado !== 'todos') {
      filters.estado = this.filtroEstado;
    }

    // Ahora envía los parámetros de paginación
    this.analisisService.listarAnalisis(filters).subscribe({
      next: (response) => {
        this.analisisList = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.currentPage = response.meta.page;
        this.conteoResultados = this.totalItems;
        this.actualizarBotonLimpiar();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar analisis:', err);
        this.isLoading = false;
      },
    });
  }

  filtrarAnalisis(): void {
    this.currentPage = 1;
    this.cargarAnalisis();
  }
  // Actualizar estado del botón "Limpiar filtros"
  actualizarBotonLimpiar(): void {
    this.hayFiltroActivo = !!this.filtroNombreAnalisis.trim() || this.filtroEstado !== 'todos';
  }
  // Limpiar todos los filtros
  limpiarFiltros(): void {
    this.filtroNombreAnalisis = '';
    this.filtroEstado = 'todos';
    this.currentPage = 1;
    this.cargarAnalisis();
  }
  // Cambiar estado (Activar/Inactivar)
  cambiarEstado(id: string, nuevoEstado: 'A' | 'I'): void {
    const analisis = this.analisisList.find((a) => a.id_analisis === id);
    const accion = nuevoEstado === 'A' ? 'activar' : 'inhabilitar';

    if (!analisis) return;

    if (confirm(`¿Estás seguro de ${accion} al análisis ${analisis.nombre_analisis}?`)) {
      if (nuevoEstado === 'I') {
        this.analisisService.inhabilitarAnalisis(id).subscribe({
          next: () => {
            console.log('Analisis inhabilitado');
            this.cargarAnalisis();
          },
          error: (err) => console.error('Error al inhabilitar:', err),
        });
      } else {
        // Para activar, usamos modificarPaciente
        this.analisisService.modificarAnalisis(id, { estado: 'A' }).subscribe({
          next: () => {
            console.log('Paciente activado');
            this.cargarAnalisis();
          },
          error: (err) => console.error('Error al activar:', err),
        });
      }
    }
  }

  // Obtener clase CSS según estado
  getEstadoClase(estado: string): string {
    return estado === 'A' ? 'badge-activo' : 'badge-inactivo';
  }
  // Obtener texto según estado
  getEstadoTexto(estado: string): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }

  //MODAL
  abrirModalCrear(): void {
    this.isEditMode = false;
    this.analisisIdEditar = null;
    this.analisisForm.reset();
    this.limpiarMensajes();
    this.abrirModal();
  }
  //ABRIR MODAL PARA EDITAR
  abrirModalEditar(analisis: any): void {
    this.isEditMode = true;
    this.analisisIdEditar = analisis.id_analisis;
    this.limpiarMensajes();

    // Prellenar el formulario
    this.analisisForm.patchValue({
      nombre_analisis: analisis.nombre_analisis,
      descripcion_analisis: analisis.descripcion_analisis,
    });

    this.abrirModal();
  }
  //ABRIR MODAL
  abrirModal(): void {
    const modalElement = document.getElementById('modalAnalisis');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  //CERRAR MODAL
  cerrarModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  //SUBMIT 
  onSubmit(): void {
    this.limpiarMensajes();

    if (this.analisisForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      this.analisisForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.analisisForm.value;

    const request$ =
      this.isEditMode && this.analisisIdEditar
        ? this.analisisService.modificarAnalisis(this.analisisIdEditar, formValues)
        : this.analisisService.registrarAnalisis(formValues);

    request$.subscribe({
      next: (response) => {
        this.successMessage = this.isEditMode
          ? 'Análisis actualizado exitosamente'
          : 'Análisis registrado exitosamente';

        this.isLoading = false;

        // Recargar lista y cerrar modal después de 1.5 segundos
        setTimeout(() => {
          this.cargarAnalisis();
          this.cerrarModal();
          this.analisisForm.reset();
        }, 1500);
      },
      error: (err) => {
        console.error('Error en la operación:', err);
        this.errorMessage = err.error?.message || 'Error al guardar el análisis';
        this.isLoading = false;
      },
    });
  }

  limpiarMensajes(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  // Navegar entre páginas
  irAPagina(page: number): void {
    this.currentPage = page;
    this.cargarAnalisis(); // Recarga los datos con la nueva página
  }
  // Cambiar tamaño de página o sea mostrar 9,10,20
  cambiarTamanoPagina(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Siempre ir a la página 1 al cambiar el límite
    this.cargarAnalisis(); // Recarga los datos con el nuevo límite
  }
}
