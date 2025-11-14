import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultadoAnalisisService, CreateResultadoDto, UpdateResultadoDto, ResultadoAnalisisData } from '../services/resultado-analisis';
import { Analisis } from '../../Analisis/model/analisis';
import { AnalisisService } from '../../Analisis/services/analisis.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crear-editar-resultado-analisis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  providers: [DatePipe],
  templateUrl: './crear-editar-resultado-analisis.html',
  styleUrls: ['./crear-editar-resultado-analisis.css']
})
export class CrearEditarResultadoAnalisis implements OnInit { 
  
  resultadoForm!: FormGroup;
  tiposDeAnalisis: Analisis[] = [];

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  
  idResultado: string | null = null;
  idControl: string | null = null;
  tipoControl: 'diagnostico' | 'puerperio' | null = null;

  pdfFile: File | null = null;
  existingPdfName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private resultadoService: ResultadoAnalisisService,
    private analisisService: AnalisisService,
    private datePipe: DatePipe,
    private location: Location 
  ) {}

  ngOnInit(): void {
    this.idResultado = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idResultado;

    this.initForm();
    this.loadTiposDeAnalisis();

    if (this.isEditMode) {
      this.loadResultadoData(this.idResultado!);
    } else {
      this.route.queryParamMap.subscribe(params => {
        this.idControl = params.get('idControl');
        const tipo = params.get('tipoControl');
        
        if (tipo === 'diagnostico' || tipo === 'puerperio') {
          this.tipoControl = tipo;
        }
        if (!this.idControl || !this.tipoControl) {
           this.errorMessage = "Error: No se especificó un control. Vuelva al listado e intente de nuevo.";
        }
      });
    }
  }

  private initForm(): void {
    const defaultDate = this.isEditMode 
      ? '' 
      : new Date().toISOString().split('T')[0];

    this.resultadoForm = this.fb.group({
      id_analisis: ['', Validators.required],
      fecha_realizacion: [defaultDate, Validators.required],
      laboratorio: ['', [Validators.required, Validators.maxLength(150)]],
      resultado: ['', [Validators.required, Validators.maxLength(1000)]],
      observacion: ['', [Validators.maxLength(500)]]
    });
  }
  
  private loadTiposDeAnalisis(): void {
     this.analisisService.listarTodosAnalisis().subscribe({
      next: (data) => { this.tiposDeAnalisis = data; },
      error: (err) => {
        console.error('Error al cargar tipos de análisis:', err);
        this.errorMessage = 'No se pudieron cargar los tipos de análisis.';
      }
    });
  }


  private loadResultadoData(id: string): void {
    this.isLoading = true;
    this.resultadoService.getResultadoById(id).subscribe({
      next: (d) => {
        const fechaFormateada = this.datePipe.transform(d.fecha_realizacion, 'yyyy-MM-dd');

        this.resultadoForm.patchValue({
          id_analisis: d.id_analisis,
          fecha_realizacion: fechaFormateada,
          laboratorio: d.laboratorio,
          resultado: d.resultado,
          observacion: d.observacion || ''
        });
        
        this.resultadoForm.get('id_analisis')?.disable(); 
        this.existingPdfName = d.ruta_pdf; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar resultado:', err);
        this.errorMessage = 'No se pudo cargar el resultado para editar.';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // validación 1: Tipo de archivo
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Error: Solo se permiten archivos PDF.';
        input.value = ''; // Limpia el input
        this.pdfFile = null;
        return;
      }
      
      // validación 2: verifica que el tamaño no supere los 5mb
      if (file.size > 5 * 1024 * 1024) { 
         this.errorMessage = 'Error: El archivo no debe superar los 5 MB.';
         input.value = ''; // Limpia el input
         this.pdfFile = null;
         return;
      }

      // Si pasa ambas validaciones
      this.pdfFile = file;
      this.errorMessage = null; // limpia cualquier error previo
    } else {
      // Si el usuario cancela la selección
      this.pdfFile = null;
    }
  }

  guardar(): void {
    
    this.errorMessage = null;
    if (this.resultadoForm.invalid) {
      this.resultadoForm.markAllAsTouched();
      this.errorMessage = "Por favor, complete todos los campos obligatorios.";
      return;
    }
    if (!this.isEditMode && (!this.idControl || !this.tipoControl)) {
      this.errorMessage = "Error: No se ha especificado un control. Vuelva al listado.";
      return;
    }
    this.isSaving = true;
    let request$: Observable<ResultadoAnalisisData>;
    if (this.isEditMode) {
      const formValues = this.resultadoForm.value; 
      const dto: UpdateResultadoDto = {
        fecha_realizacion: formValues.fecha_realizacion,
        laboratorio: formValues.laboratorio,
        resultado: formValues.resultado,
        observacion: formValues.observacion || undefined
      };
      request$ = this.resultadoService.actualizarResultado(this.idResultado!, dto);
    } else {
      const formValues = this.resultadoForm.getRawValue(); 
      const dto: CreateResultadoDto = {
        id_analisis: formValues.id_analisis,
        fecha_realizacion: formValues.fecha_realizacion,
        laboratorio: formValues.laboratorio,
        resultado: formValues.resultado,
        observacion: formValues.observacion || undefined
      };
      if (this.tipoControl === 'diagnostico') {
        dto.id_control_diagnostico = this.idControl!;
      } else {
        dto.id_control_puerperio = this.idControl!;
      }
      request$ = this.resultadoService.crearResultado(dto);
    }

    request$.subscribe({
      next: (savedResult) => {
        if (this.pdfFile) {
          this.resultadoService.uploadPdf(savedResult.id_resultado_analisis, this.pdfFile).subscribe({
            next: () => {
              this.isSaving = false;
              alert(this.isEditMode ? 'Resultado actualizado y PDF subido' : 'Resultado y PDF registrados');
              this.location.back(); 
            },
            error: (errPdf) => {
              this.errorMessage = `Error: ${errPdf.error?.message}. Los datos de texto se guardaron, pero el PDF falló.`;
              this.isSaving = false;
            }
          });
        } else {
          this.isSaving = false;
          alert(this.isEditMode ? 'Resultado actualizado' : 'Resultado registrado');
          this.location.back(); 
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ocurrió un error al guardar.';
        this.isSaving = false;
      }
    });
  }

  cancelar(): void {
    this.location.back(); 
  }
  isInvalid(controlName: string): boolean {
    const control = this.resultadoForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.resultadoForm.get(controlName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio.';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
    return 'Valor inválido.';
  }
}